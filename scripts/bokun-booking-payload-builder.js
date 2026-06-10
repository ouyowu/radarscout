const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PHASE1_REPORT_PATH = path.join(process.cwd(), '.ai', 'bokun-direct-booking-probe-phase1.md');
const REPORT_PATH = path.join(process.cwd(), '.ai', 'bokun-booking-payload-builder-phase2.md');
const RESOLVER_REPORT_PATH = path.join(process.cwd(), '.ai', 'bokun-direct-booking-phase2b-resolver.md');
const SAFE_ENV_FILES = ['.env.local', '.env.development', 'apps/web/.env.local', 'apps/web/.env.development'];
const FORBIDDEN_ENDPOINT_PATTERN = /shopping-cart|checkout|booking\.json|reservation|payment|confirm/i;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

for (const file of SAFE_ENV_FILES) loadEnvFile(path.join(process.cwd(), file));

const accessKey = process.env.BOKUN_ACCESS_KEY;
const secretKey = process.env.BOKUN_SECRET_KEY;
const baseUrl = (process.env.BOKUN_API_BASE_URL || process.env.BOKUN_API_URL || 'https://api.bokun.io').replace(/\/$/, '');
const defaultCurrency = process.env.BOKUN_DEFAULT_CURRENCY || 'USD';

function formatBokunDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function signHeaders(method, pathWithQuery) {
  const date = formatBokunDate(new Date());
  const signature = crypto
    .createHmac('sha1', secretKey)
    .update(`${date}${accessKey}${method.toUpperCase()}${pathWithQuery}`)
    .digest('base64');

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Bokun-Date': date,
    'X-Bokun-AccessKey': accessKey,
    'X-Bokun-Signature': signature,
  };
}

function sanitize(value, limit = 1200) {
  if (!value) return null;
  return JSON.stringify(value).replace(/[A-Za-z0-9_-]{24,}/g, '[redacted-token]').slice(0, limit);
}

async function bokunRequest(method, pathWithQuery, body) {
  if (!accessKey || !secretKey) {
    return { ok: false, status: 'NO_CREDENTIALS', body: null, error: 'Missing local Bókun credentials' };
  }

  if (FORBIDDEN_ENDPOINT_PATTERN.test(pathWithQuery)) {
    return { ok: false, status: 'BLOCKED_BY_BUILDER', body: null, error: 'Endpoint blocked by dry-run payload builder rules' };
  }

  try {
    const response = await fetch(`${baseUrl}${pathWithQuery}`, {
      method,
      headers: signHeaders(method, pathWithQuery),
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    let parsed = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      body: parsed,
      error: response.ok ? null : sanitize(parsed),
    };
  } catch (error) {
    return { ok: false, status: 'FETCH_ERROR', body: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function getProbeDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 8);
  return date.toISOString().slice(0, 10);
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const item = process.argv.find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : null;
}

function findReadyActivityIdFromReport() {
  if (!fs.existsSync(PHASE1_REPORT_PATH)) {
    throw new Error(`Missing Phase 1 report at ${PHASE1_REPORT_PATH}`);
  }

  const content = fs.readFileSync(PHASE1_REPORT_PATH, 'utf8');
  const sections = content.split(/\n### /).slice(1);
  for (const section of sections) {
    if (!section.includes('- Safe for direct booking test: yes')) continue;
    const firstLine = section.split('\n')[0] || '';
    const match = firstLine.match(/^(\d+)\s+—\s+(.+)$/);
    if (match) return { activityId: match[1], title: match[2].trim() };
  }

  throw new Error('No Phase 1 product marked safe for direct booking test was found.');
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textOf(value) {
  return JSON.stringify(value || '').toLowerCase();
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function deepFindValues(value, keyPattern, limit = 40, results = [], pathParts = []) {
  if (results.length >= limit || !value || typeof value !== 'object') return results;
  if (Array.isArray(value)) {
    value.forEach((item, index) => deepFindValues(item, keyPattern, limit, results, [...pathParts, String(index)]));
    return results;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...pathParts, key];
    if (keyPattern.test(key) && child !== null && child !== undefined && typeof child !== 'object') {
      results.push({ key, value: child, path: nextPath.join('.') });
    }
    deepFindValues(child, keyPattern, limit, results, nextPath);
  }
  return results;
}

function deepFindObjects(value, keyPattern, limit = 40, results = [], pathParts = []) {
  if (results.length >= limit || !value || typeof value !== 'object') return results;
  if (Array.isArray(value)) {
    value.forEach((item, index) => deepFindObjects(item, keyPattern, limit, results, [...pathParts, String(index)]));
    return results;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...pathParts, key];
    if (keyPattern.test(key)) results.push({ key, value: child, path: nextPath.join('.') });
    deepFindObjects(child, keyPattern, limit, results, nextPath);
  }
  return results;
}

function firstValue(values) {
  return values.length ? values[0].value : null;
}

function uniquePrimitive(values) {
  const seen = new Set();
  const result = [];
  for (const item of values) {
    const value = item && typeof item === 'object' && 'value' in item ? item.value : item;
    if (value === null || value === undefined || value === '') continue;
    if (typeof value === 'boolean') continue;
    const key = String(value);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function extractImages(raw) {
  return [
    raw?.keyPhoto?.url,
    raw?.keyPhoto?.originalUrl,
    raw?.keyPhoto?.derived?.[0]?.url,
    ...asArray(raw?.photos).flatMap((photo) => [photo?.url, photo?.originalUrl, photo?.derived?.[0]?.url]),
  ].filter(Boolean);
}

function extractVendor(product, raw) {
  const vendor = raw?.vendor || raw?.supplier || {};
  return {
    id: product.supplier?.bokunVendorId || product.supplierId || vendor.id || raw?.vendorId || raw?.supplierId || null,
    title: product.supplier?.title || vendor.title || vendor.name || raw?.supplierName || null,
  };
}

function extractDestination(product, raw) {
  const place = asArray(raw?.places)[0] || {};
  const location = place.location || {};
  const google = raw?.googlePlace || {};
  return {
    city: product.city || google.city || google.locality || place.title || raw?.city || null,
    country: google.country || location.country || raw?.country || null,
    countryCode: google.countryCode || location.countryCode || raw?.locationCode || null,
    destination: product.location || google.city || place.title || raw?.locationCode || null,
  };
}

function hasPrice(product, raw) {
  return [product.retailPrice, product.netSettlementPrice, raw?.price, raw?.nextAvailablePrice, raw?.fromPrice]
    .some((value) => value !== null && value !== undefined && Number(value) > 0);
}

function hasAvailabilitySignal(...sources) {
  const combined = textOf(sources);
  return /available|availability|inventory|departure|start.?time|vacanc|capacity|rate/.test(combined);
}

function hasPriceSignal(product, ...sources) {
  if (hasPrice(product, product.rawJson || {})) return true;
  const combined = textOf(sources);
  return /price|amount|currency|rate|pricing/.test(combined);
}

function detectConfirmation(...sources) {
  const combined = textOf(sources);
  if (/instant|automatic confirmation|auto.?confirm/.test(combined)) return 'instant';
  if (/on.?request|request.?to.?book|manual confirmation|supplier confirmation|pending/.test(combined)) return 'on-request';
  return 'unknown';
}

function detectPickupRequirement(...sources) {
  const combined = textOf(sources);
  if (/"meetingtype"\s*:\s*"pick_up"|"meetingtype"\s*:\s*"pickup"|pickup required|required pickup|hotel pick.?up|pick-up included|pick up included/.test(combined)) return 'yes';
  if (/"meetingtype"\s*:\s*"meet_on_location"|meeting point|meet on location|no pickup/.test(combined)) return 'no';
  if (/pick.?up|pickup/.test(combined)) return 'unknown';
  return 'no';
}

function findPickupCandidates(...sources) {
  const values = deepFindValues(sources, /pickupPlaceId|pickupId|pickup_place_id|pickupPlace/i, 40);
  const objects = [
    ...deepFindObjects(sources, /pickupPlaces|pickupOptions|pickupLocations|pickupService|pickup/i, 40),
  ];
  const labels = [];
  const ids = [...values];

  for (const object of objects) {
    const value = object.value;
    const items = Array.isArray(value) ? value : [value];
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      const id = item.id || item.pickupPlaceId || item.placeId || item.value;
      const label = item.title || item.name || item.label || item.description || item.address || item.text;
      if (id) ids.push({ key: object.key, value: id, path: object.path });
      if (label) labels.push(stripHtml(label));
    }
  }

  return {
    ids: uniquePrimitive(ids).slice(0, 20),
    labels: uniquePrimitive(labels).slice(0, 20),
  };
}

function findStartTimeCandidates(...sources) {
  const direct = deepFindValues(sources, /startTime|start_time|departureTime|timeOfDay|startHour|openFrom/i, 50);
  const intervals = [];
  for (const object of deepFindObjects(sources, /timeIntervals|startTimes|availabilities|availability/i, 80)) {
    const items = Array.isArray(object.value) ? object.value : [object.value];
    for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      if (Array.isArray(item.openFrom)) intervals.push(item.openFrom.map((value) => String(value).padStart(2, '0')).join(':'));
      if (item.startTime) intervals.push(item.startTime);
      if (item.startTimeId) intervals.push(`startTimeId:${item.startTimeId}`);
      if (item.id && /startTimes|availabilities|availability/i.test(object.key)) intervals.push(`id:${item.id}`);
    }
  }
  return uniquePrimitive([...direct, ...intervals]).slice(0, 30);
}

function findRateCandidates(...sources) {
  const rateIds = uniquePrimitive(deepFindValues(sources, /^rateId$|rateid|rate_id|ratesId/i, 50));
  const rateObjects = deepFindObjects(sources, /^rates$|rate/i, 50).flatMap((item) => asArray(item.value));
  for (const rate of rateObjects) {
    if (rate && typeof rate === 'object' && (rate.id || rate.rateId)) rateIds.push(rate.id || rate.rateId);
  }
  return uniquePrimitive(rateIds).slice(0, 20);
}

function findPricingCategoryCandidates(...sources) {
  const ids = uniquePrimitive(deepFindValues(sources, /pricingCategoryId|pricing_category_id|priceCategoryId|categoryId/i, 80));
  const objects = deepFindObjects(sources, /pricingCategories|priceCategories|categories/i, 80).flatMap((item) => asArray(item.value));
  for (const category of objects) {
    if (category && typeof category === 'object' && (category.id || category.pricingCategoryId)) ids.push(category.id || category.pricingCategoryId);
  }
  return uniquePrimitive(ids).slice(0, 30);
}

function extractQuestionDrafts(...sources) {
  const questionObjects = [];
  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    questionObjects.push(
      ...asArray(source.bookingQuestions),
      ...asArray(source.questions),
      ...asArray(source.bookingFields),
      ...asArray(source.customFields),
      ...asArray(source.passengerFields),
      ...asArray(source.requiredCustomerFields),
    );
  }

  const directObjects = [
    ...deepFindObjects(sources, /question|bookingField|passengerField|requiredCustomerField|customField/i, 40).map((item) => item.value),
  ];

  const normalized = [...questionObjects, ...directObjects]
    .filter(Boolean)
    .map((question, index) => {
      if (typeof question === 'string') return { id: `question_${index + 1}`, label: question, required: 'unknown', answer: 'TEST VALUE' };
      if (typeof question !== 'object') return null;
      const id = question.id || question.questionId || question.key || question.name || `question_${index + 1}`;
      const label = question.label || question.title || question.question || question.name || question.key || id;
      const required = typeof question.required === 'boolean' ? question.required : typeof question.mandatory === 'boolean' ? question.mandatory : 'unknown';
      return { id, label: stripHtml(label), required, answer: 'TEST VALUE' };
    })
    .filter(Boolean);

  const unique = new Map();
  for (const question of normalized) unique.set(String(question.id), question);
  return [...unique.values()].slice(0, 30);
}

function extractPickupDraft(...sources) {
  const required = detectPickupRequirement(...sources);
  const candidates = findPickupCandidates(...sources);
  if (required === 'yes' || candidates.ids.length || candidates.labels.length) {
    return {
      required: required === 'yes',
      status: required,
      pickupPlaceId: candidates.ids[0] || null,
      pickupPlaceDescription: candidates.labels[0] || (candidates.ids[0] ? 'TEST PICKUP PLACE' : 'UNKNOWN PICKUP'),
      hotelName: 'TEST HOTEL',
      address: 'TEST PICKUP ADDRESS',
      candidates,
    };
  }
  return { required: false, status: required, candidates };
}

function extractParticipantDraft(...sources) {
  const pricingCategoryId = findPricingCategoryCandidates(...sources)[0];
  return [{
    pricingCategoryId: pricingCategoryId || 'UNKNOWN_PRICING_CATEGORY',
    count: 1,
    passengerType: 'ADULT',
    firstName: 'TEST',
    lastName: 'CUSTOMER',
  }];
}

function buildPayload({ product, detail, pricing, availabilityGet, availabilityPost, pickupPlaces, questionsEndpoint, date }) {
  const raw = product.rawJson || {};
  const sources = [raw, detail.body, pricing.body, availabilityGet.body, availabilityPost.body, pickupPlaces.body, questionsEndpoint.body];
  const rateId = findRateCandidates(...sources)[0];
  const availabilityId = firstValue(deepFindValues(sources, /availabilityId|startTimeId|departureId|timeId/i));
  const startTime = findStartTimeCandidates(...sources)[0];
  const questions = extractQuestionDrafts(...sources);
  const pickup = extractPickupDraft(...sources);
  const participants = extractParticipantDraft(...sources);
  const currency = product.currency || defaultCurrency;

  return {
    dryRunOnly: true,
    doNotSubmit: true,
    activityId: product.bokunActivityId,
    productId: product.id,
    date,
    startTime: startTime || 'UNKNOWN_START_TIME',
    availabilityId: availabilityId || 'UNKNOWN_AVAILABILITY_ID',
    rateId: rateId || 'UNKNOWN_RATE_ID',
    pricingCategoryId: participants[0].pricingCategoryId,
    participants,
    leadPassenger: {
      firstName: 'TEST',
      lastName: 'CUSTOMER',
      email: 'test@example.com',
      phone: '+66000000000',
    },
    questions,
    pickup,
    currency,
    language: 'EN',
    externalBookingReference: `RADARSCOUT-DRYRUN-${product.bokunActivityId}`,
  };
}

function checkPayload(payload, context) {
  const missing = [];
  const blocking = [];
  const warnings = [];

  if (!payload.activityId) blocking.push('missing activityId');
  if (!payload.date) blocking.push('missing date');
  if (!payload.participants?.length) blocking.push('missing participants');
  if (!payload.leadPassenger?.firstName || !payload.leadPassenger?.lastName) blocking.push('missing lead traveler');
  if (!payload.leadPassenger?.email) blocking.push('missing contact email');
  if (!payload.leadPassenger?.phone) blocking.push('missing contact phone');
  if (!context.priceSignal) blocking.push('missing price signal');
  if (!context.availabilitySignal) blocking.push('missing availability signal');
  if (payload.rateId === 'UNKNOWN_RATE_ID') missing.push('rateId unknown');
  if (payload.pricingCategoryId === 'UNKNOWN_PRICING_CATEGORY') missing.push('pricingCategoryId unknown');
  if (payload.availabilityId === 'UNKNOWN_AVAILABILITY_ID' && payload.startTime === 'UNKNOWN_START_TIME') warnings.push('availabilityId/startTime not discovered');
  if (payload.pickup?.required && !payload.pickup.pickupPlaceId) missing.push('pickup place id unknown');
  if (context.confirmationMode !== 'instant') blocking.push(`confirmation mode ${context.confirmationMode}`);

  const completeness = blocking.length > 0 ? 'Incomplete' : missing.length > 0 ? 'Unknown' : 'Complete';
  return { completeness, missing, blocking, warnings };
}

async function fetchProbeInputs(product, date) {
  const currency = product.currency || defaultCurrency;
  const activityId = encodeURIComponent(product.bokunActivityId);
  const detailPath = `/activity.json/${activityId}?${new URLSearchParams({ lang: 'EN', currency }).toString()}`;
  const pricingPath = `/activity.json/${activityId}/pricing?${new URLSearchParams({ currency }).toString()}`;
  const availabilityGetPath = `/activity.json/${activityId}/availabilities?${new URLSearchParams({ start: date, end: date, currency }).toString()}`;
  const availabilityPostPath = `/activity.json/${activityId}/availability`;
  const pickupPlacesPath = `/activity.json/${activityId}/pickup-places?${new URLSearchParams({ lang: 'EN' }).toString()}`;
  const questionsPath = `/activity.json/${activityId}/questions?${new URLSearchParams({ lang: 'EN' }).toString()}`;

  return {
    detail: await bokunRequest('GET', detailPath),
    pricing: await bokunRequest('GET', pricingPath),
    availabilityGet: await bokunRequest('GET', availabilityGetPath),
    availabilityPost: await bokunRequest('POST', availabilityPostPath, { date, participants: { adults: 1, children: 0 } }),
    pickupPlaces: await bokunRequest('GET', pickupPlacesPath),
    questionsEndpoint: await bokunRequest('GET', questionsPath),
  };
}

function summarizeProduct(product, inputs, payload, check) {
  const sources = [product.rawJson, inputs.detail.body, inputs.pricing.body, inputs.availabilityGet.body, inputs.availabilityPost.body, inputs.pickupPlaces.body, inputs.questionsEndpoint.body];
  const vendor = extractVendor(product, product.rawJson || {});
  const destination = extractDestination(product, product.rawJson || {});
  return {
    id: product.id,
    activityId: product.bokunActivityId,
    title: product.title,
    vendor,
    destination,
    hasImage: extractImages(product.rawJson || {}).length > 0,
    hasBasePrice: hasPrice(product, product.rawJson || {}),
    pickupStatus: payload.pickup.status || (payload.pickup.required ? 'yes' : 'no'),
    pickupPlaceIdCandidates: payload.pickup.candidates?.ids || [],
    pickupOptionLabels: payload.pickup.candidates?.labels || [],
    startTimeCandidates: findStartTimeCandidates(...sources),
    rateIdCandidates: findRateCandidates(...sources),
    pricingCategoryIdCandidates: findPricingCategoryCandidates(...sources),
    requiredQuestions: payload.questions,
    participantFields: payload.participants,
    confirmationMode: detectConfirmation(...sources),
    availabilitySignal: hasAvailabilitySignal(...sources),
    priceSignal: hasPriceSignal(product, ...sources),
    apiStatuses: {
      detail: inputs.detail.ok ? 'success' : `failed ${inputs.detail.status}`,
      pricing: inputs.pricing.ok ? 'success' : `failed ${inputs.pricing.status}`,
      availabilityGet: inputs.availabilityGet.ok ? 'success' : `failed ${inputs.availabilityGet.status}`,
      availabilityPost: inputs.availabilityPost.ok ? 'success' : `failed ${inputs.availabilityPost.status}`,
      pickupPlaces: inputs.pickupPlaces.ok ? 'success' : `failed ${inputs.pickupPlaces.status}`,
      questions: inputs.questionsEndpoint.ok ? 'success' : `failed ${inputs.questionsEndpoint.status}`,
    },
    payloadCompleteness: check.completeness,
    missing: check.missing,
    blocking: check.blocking,
    warnings: check.warnings,
  };
}

async function loadProductByActivityId(activityId) {
  return prisma.bokunProduct.findUnique({
    where: { bokunActivityId: String(activityId) },
    select: {
      id: true,
      bokunActivityId: true,
      supplierId: true,
      title: true,
      city: true,
      location: true,
      retailPrice: true,
      netSettlementPrice: true,
      currency: true,
      active: true,
      rawJson: true,
      supplier: { select: { bokunVendorId: true, title: true } },
    },
  });
}

function candidateScore(summary, product) {
  let score = 0;
  if (product.active) score += 5;
  if (summary.hasImage) score += 5;
  if (summary.hasBasePrice) score += 5;
  if (summary.vendor.id || summary.vendor.title) score += 4;
  if (summary.destination.city || summary.destination.country || summary.destination.countryCode || summary.destination.destination) score += 4;
  if (summary.availabilitySignal) score += 4;
  if (summary.priceSignal) score += 4;
  if (summary.confirmationMode === 'instant') score += 5;
  if (summary.pickupStatus === 'no') score += 4;
  if (summary.pickupStatus === 'yes') score -= 3;
  if (summary.requiredQuestions.length === 0) score += 3;
  if (summary.requiredQuestions.length > 5) score -= 2;
  const text = textOf([product.title, product.rawJson]);
  if (/multi.?day|\b\d+\s*days?\b|safari|private custom|tailor/.test(text)) score -= 6;
  if (/transfer|food|walking|museum|show|ticket|class|tour/.test(text)) score += 2;
  if (summary.blocking.length === 0 && summary.missing.length === 0) score += 4;
  return score;
}

async function findBetterCandidates(excludeActivityId, limit = 5) {
  const products = await prisma.bokunProduct.findMany({
    where: { active: true, NOT: { bokunActivityId: String(excludeActivityId) } },
    select: {
      id: true,
      bokunActivityId: true,
      supplierId: true,
      title: true,
      city: true,
      location: true,
      retailPrice: true,
      netSettlementPrice: true,
      currency: true,
      active: true,
      rawJson: true,
      supplier: { select: { bokunVendorId: true, title: true } },
    },
  });

  const prefiltered = products
    .filter((product) => {
      const raw = product.rawJson || {};
      const text = textOf([product.title, raw]);
      if (!product.bokunActivityId || !product.title || !extractImages(raw).length || !hasPrice(product, raw)) return false;
      if (/multi.?day|\b\d+\s*days?\b|safari|private custom|tailor/.test(text)) return false;
      return true;
    })
    .sort((a, b) => {
      const pickupA = detectPickupRequirement(a.rawJson || {}) === 'yes' ? 1 : 0;
      const pickupB = detectPickupRequirement(b.rawJson || {}) === 'yes' ? 1 : 0;
      return pickupA - pickupB || String(a.title).localeCompare(String(b.title));
    })
    .slice(0, 25);

  const date = getProbeDate();
  const results = [];
  for (const product of prefiltered) {
    const inputs = await fetchProbeInputs(product, date);
    const payload = buildPayload({ product, ...inputs, date });
    const sources = [product.rawJson, inputs.detail.body, inputs.pricing.body, inputs.availabilityGet.body, inputs.availabilityPost.body, inputs.pickupPlaces.body, inputs.questionsEndpoint.body];
    const context = {
      priceSignal: hasPriceSignal(product, ...sources),
      availabilitySignal: hasAvailabilitySignal(...sources),
      confirmationMode: detectConfirmation(...sources),
    };
    const check = checkPayload(payload, context);
    const summary = summarizeProduct(product, inputs, payload, check);
    results.push({ product, summary, score: candidateScore(summary, product) });
  }

  return results
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title))
    .slice(0, limit);
}

function writePhase2Report({ product, payload, check, inputs, context }) {
  const vendor = extractVendor(product, product.rawJson || {});
  const destination = extractDestination(product, product.rawJson || {});
  const readyForSandboxSubmit = check.completeness === 'Complete' ? 'Yes' : check.completeness === 'Unknown' ? 'Unknown' : 'No';
  const mainBlocker = check.blocking[0] || check.missing[0] || check.warnings[0] || 'none';
  const lines = [];

  lines.push('# Bókun Direct Booking Phase 2 — Sandbox Booking Payload Builder');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('Database writes happened: No');
  lines.push('Real booking created: No');
  lines.push('Checkout submitted: No');
  lines.push('Payment touched: No');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Selected product: ${product.bokunActivityId} — ${product.title}`);
  lines.push(`- Payload completeness: ${check.completeness}`);
  lines.push(`- Ready for sandbox submit test: ${readyForSandboxSubmit}`);
  lines.push(`- Main blocker: ${mainBlocker}`);
  lines.push('');
  lines.push('## Selected Product');
  lines.push('');
  lines.push(`- Product id: ${product.id}`);
  lines.push(`- Bókun activity id: ${product.bokunActivityId}`);
  lines.push(`- Title: ${product.title}`);
  lines.push(`- Supplier/vendor: ${vendor.title || vendor.id || 'Unknown'}`);
  lines.push(`- Country/city/destination: ${[destination.city, destination.country || destination.countryCode || destination.destination].filter(Boolean).join(', ') || 'Unknown'}`);
  lines.push('');
  lines.push('## Availability / Pricing Inputs');
  lines.push('');
  lines.push(`- Currency: ${payload.currency}`);
  lines.push(`- Detail probe: ${inputs.detail.ok ? 'success' : `failed ${inputs.detail.status}`}`);
  lines.push(`- Pricing probe: ${inputs.pricing.ok ? 'success' : `failed ${inputs.pricing.status}`}`);
  lines.push(`- Availability GET probe: ${inputs.availabilityGet.ok ? 'success' : `failed ${inputs.availabilityGet.status}`}`);
  lines.push(`- Availability POST probe: ${inputs.availabilityPost.ok ? 'success' : `failed ${inputs.availabilityPost.status}`}`);
  lines.push(`- Pickup places probe: ${inputs.pickupPlaces.ok ? 'success' : `failed ${inputs.pickupPlaces.status}`}`);
  lines.push(`- Questions probe: ${inputs.questionsEndpoint.ok ? 'success' : `failed ${inputs.questionsEndpoint.status}`}`);
  lines.push(`- Price signal: ${context.priceSignal ? 'yes' : 'no'}`);
  lines.push(`- Availability signal: ${context.availabilitySignal ? 'yes' : 'no'}`);
  lines.push(`- rateId: ${payload.rateId}`);
  lines.push(`- pricingCategoryId: ${payload.pricingCategoryId}`);
  lines.push(`- startTime: ${payload.startTime}`);
  lines.push(`- availabilityId: ${payload.availabilityId}`);
  lines.push('');
  lines.push('## Required Questions');
  lines.push('');
  if (payload.questions.length === 0) lines.push('- None discovered.');
  else for (const question of payload.questions) lines.push(`- ${question.id}: ${question.label} -> ${question.answer}`);
  lines.push('');
  lines.push('## Pickup Requirements');
  lines.push('');
  lines.push(`- Required: ${payload.pickup.required ? 'yes' : 'no'}`);
  lines.push(`- Status: ${payload.pickup.status || 'unknown'}`);
  if (payload.pickup.required || payload.pickup.status === 'unknown') {
    lines.push(`- Pickup place id: ${payload.pickup.pickupPlaceId || 'UNKNOWN'}`);
    lines.push(`- Pickup placeholder: ${payload.pickup.pickupPlaceDescription || 'UNKNOWN PICKUP'}`);
  }
  lines.push('');
  lines.push('## Participant Requirements');
  lines.push('');
  lines.push('- Participant count: 1 adult');
  lines.push(`- Participant pricing category: ${payload.pricingCategoryId}`);
  lines.push('- Lead passenger: TEST CUSTOMER / test@example.com / +66000000000');
  lines.push('');
  lines.push('## Confirmation Mode Evidence');
  lines.push('');
  lines.push(`- Confirmation mode: ${context.confirmationMode}`);
  if (context.confirmationMode === 'unknown') lines.push('- confirmation mode remains unknown');
  lines.push('');
  lines.push('## Generated Dry-run Payload');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(payload, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('## Missing Fields');
  lines.push('');
  lines.push(`- Payload completeness: ${check.completeness}`);
  lines.push(`- Missing fields: ${check.missing.length ? check.missing.join('; ') : 'none'}`);
  lines.push(`- Blocking fields: ${check.blocking.length ? check.blocking.join('; ') : 'none'}`);
  lines.push(`- Non-blocking warnings: ${check.warnings.length ? check.warnings.join('; ') : 'none'}`);
  lines.push('');
  lines.push('## Risk Notes');
  lines.push('');
  lines.push('- This payload is a dry-run draft only and must not be submitted as a checkout or booking request.');
  lines.push('- Customer data is fake test data only.');
  lines.push('- The script blocks shopping-cart, checkout, booking, reservation, payment, and confirm endpoint patterns.');
  lines.push('- If rateId, pricingCategoryId, pickup place ID, or startTime remain unknown, do not attempt sandbox submit.');
  lines.push('- Even with a complete payload, supplier approval and sandbox/test environment confirmation are required before any submit test.');
  lines.push('');
  lines.push('## Recommended Next Step');
  lines.push('');
  lines.push('Manually inspect this product in Bókun and confirm the exact rateId, pricing category, pickup schema, required questions, and whether the account has a real sandbox/test booking mode. Do not enable public checkout until a non-production submit path is confirmed.');

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${lines.join('\n')}\n`);
  return { readyForSandboxSubmit, mainBlocker };
}

function formatList(values) {
  if (!values || values.length === 0) return 'none';
  return values.map((value) => `\`${String(value)}\``).join(', ');
}

function writeResolverReport({ product, summary, candidates, payload, check }) {
  const lines = [];
  const destinationText = [summary.destination.city, summary.destination.country || summary.destination.countryCode || summary.destination.destination].filter(Boolean).join(', ') || 'Unknown';
  const pickupFound = summary.pickupPlaceIdCandidates.length > 0;
  const startTimeFound = summary.startTimeCandidates.length > 0;
  const questionsParsed = summary.requiredQuestions.length > 0;
  const stillSuitable = check.completeness === 'Complete' ? 'Yes' : check.completeness === 'Unknown' ? 'Unknown' : 'No';
  const recommended = candidates[0];

  lines.push('# Bókun Direct Booking Phase 2B — Pickup / StartTime / Questions Resolver');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('Database writes happened: No');
  lines.push('Real booking created: No');
  lines.push('Checkout submitted: No');
  lines.push('Payment touched: No');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Product resolved: ${product.bokunActivityId} — ${product.title}`);
  lines.push(`- 1174109 pickupPlaceId found: ${pickupFound ? 'yes' : 'no'}`);
  lines.push(`- 1174109 startTime found: ${startTimeFound ? 'yes' : 'no'}`);
  lines.push(`- 1174109 required questions parsed: ${questionsParsed ? 'yes' : 'no'}`);
  lines.push(`- 1174109 sandbox submit suitability: ${stillSuitable}`);
  lines.push(`- Better first booking test candidates: ${candidates.length}`);
  lines.push(`- Recommended first test product: ${recommended ? `${recommended.product.bokunActivityId} — ${recommended.product.title}` : 'none'}`);
  lines.push('');
  lines.push('## Product 1174109 Resolver Result');
  lines.push('');
  lines.push(`- Product id: ${product.id}`);
  lines.push(`- Bókun activity id: ${product.bokunActivityId}`);
  lines.push(`- Title: ${product.title}`);
  lines.push(`- Supplier/vendor: ${summary.vendor.title || summary.vendor.id || 'Unknown'}`);
  lines.push(`- Country/city/destination: ${destinationText}`);
  lines.push(`- API statuses: detail ${summary.apiStatuses.detail}; pricing ${summary.apiStatuses.pricing}; availability GET ${summary.apiStatuses.availabilityGet}; availability POST ${summary.apiStatuses.availabilityPost}; pickup places ${summary.apiStatuses.pickupPlaces}; questions ${summary.apiStatuses.questions}`);
  lines.push('');
  lines.push('## Pickup Resolver');
  lines.push('');
  lines.push(`- Is pickup required: ${summary.pickupStatus}`);
  lines.push(`- pickupPlaceId candidates: ${formatList(summary.pickupPlaceIdCandidates)}`);
  lines.push(`- pickup option labels: ${summary.pickupOptionLabels.length ? summary.pickupOptionLabels.join('; ') : 'none'}`);
  if (!pickupFound) lines.push('- pickupPlaceId remains unknown');
  lines.push('');
  lines.push('## Start Time Resolver');
  lines.push('');
  lines.push(`- startTime candidates: ${formatList(summary.startTimeCandidates)}`);
  if (!startTimeFound) lines.push('- startTime remains unknown');
  lines.push('');
  lines.push('## Rate / Pricing Category Resolver');
  lines.push('');
  lines.push(`- rateId candidates: ${formatList(summary.rateIdCandidates)}`);
  lines.push(`- pricingCategoryId candidates: ${formatList(summary.pricingCategoryIdCandidates)}`);
  lines.push('');
  lines.push('## Required Questions Resolver');
  lines.push('');
  if (summary.requiredQuestions.length === 0) lines.push('- No required questions discovered.');
  else for (const question of summary.requiredQuestions) lines.push(`- ${question.id}: ${question.label} (required: ${question.required})`);
  lines.push('');
  lines.push('## Participant Schema Resolver');
  lines.push('');
  for (const participant of summary.participantFields) {
    lines.push(`- ${participant.passengerType}: count ${participant.count}, pricingCategoryId ${participant.pricingCategoryId}`);
  }
  lines.push('');
  lines.push('## Updated Dry-run Payload Status');
  lines.push('');
  lines.push(`- Payload completeness after resolver: ${check.completeness}`);
  lines.push(`- Missing fields: ${check.missing.length ? check.missing.join('; ') : 'none'}`);
  lines.push(`- Blocking fields: ${check.blocking.length ? check.blocking.join('; ') : 'none'}`);
  lines.push(`- Warnings: ${check.warnings.length ? check.warnings.join('; ') : 'none'}`);
  lines.push('');
  lines.push('## Remaining Blockers');
  lines.push('');
  if (check.blocking.length === 0 && check.missing.length === 0) lines.push('- none detected by resolver, but sandbox/test submit mode still needs manual confirmation.');
  else for (const blocker of [...check.blocking, ...check.missing]) lines.push(`- ${blocker}`);
  lines.push('');
  lines.push('## Better First Booking Test Candidates');
  lines.push('');
  if (candidates.length === 0) {
    lines.push('- No better candidates found in this dry-run probe.');
  } else {
    for (const candidate of candidates) {
      const item = candidate.summary;
      const candidateDestination = [item.destination.city, item.destination.country || item.destination.countryCode || item.destination.destination].filter(Boolean).join(', ') || 'Unknown';
      lines.push(`### ${candidate.product.bokunActivityId} — ${candidate.product.title}`);
      lines.push('');
      lines.push(`- Supplier/vendor: ${item.vendor.title || item.vendor.id || 'Unknown'}`);
      lines.push(`- Country/city/destination: ${candidateDestination}`);
      lines.push(`- Price: ${candidate.product.currency || defaultCurrency} ${candidate.product.retailPrice || candidate.product.rawJson?.price || 'Unknown'}`);
      lines.push(`- Pickup status: ${item.pickupStatus}`);
      lines.push(`- Required questions status: ${item.requiredQuestions.length ? `${item.requiredQuestions.length} detected` : 'none discovered'}`);
      lines.push(`- Availability signal: ${item.availabilitySignal ? 'yes' : 'no'}`);
      lines.push(`- Pricing signal: ${item.priceSignal ? 'yes' : 'no'}`);
      lines.push(`- Confirmation mode: ${item.confirmationMode}`);
      lines.push(`- Why easier than 1174109: shorter/simpler product shape, lower pickup complexity score, and no multi-day safari/private-custom route signals in prefilter.`);
      lines.push('');
    }
  }
  lines.push('## Recommendation');
  lines.push('');
  if (recommended) {
    lines.push(`Choose ${recommended.product.bokunActivityId} — ${recommended.product.title} as the next dry-run candidate before any sandbox submit attempt. Continue resolving 1174109 only after pickupPlaceId and supplier pickup schema are manually confirmed in Bókun.`);
  } else {
    lines.push('Continue resolving 1174109 manually in Bókun because this dry-run did not find a safer simple candidate.');
  }

  fs.mkdirSync(path.dirname(RESOLVER_REPORT_PATH), { recursive: true });
  fs.writeFileSync(RESOLVER_REPORT_PATH, `${lines.join('\n')}\n`);

  return {
    reportPath: RESOLVER_REPORT_PATH,
    productId: product.bokunActivityId,
    productTitle: product.title,
    pickupPlaceIdFound: pickupFound,
    startTimeFound,
    questionsParsed,
    stillSuitable,
    candidateCount: candidates.length,
    recommendedProduct: recommended ? `${recommended.product.bokunActivityId} — ${recommended.product.title}` : null,
    databaseWrites: false,
    realBookingCreated: false,
  };
}

async function runPhase2Default() {
  const selected = findReadyActivityIdFromReport();
  const product = await loadProductByActivityId(selected.activityId);
  if (!product) throw new Error(`BokunProduct not found for activity ${selected.activityId}`);

  const date = getProbeDate();
  const inputs = await fetchProbeInputs(product, date);
  const payload = buildPayload({ product, ...inputs, date });
  const sources = [product.rawJson, inputs.detail.body, inputs.pricing.body, inputs.availabilityGet.body, inputs.availabilityPost.body, inputs.pickupPlaces.body, inputs.questionsEndpoint.body];
  const context = {
    priceSignal: hasPriceSignal(product, ...sources),
    availabilitySignal: hasAvailabilitySignal(...sources),
    confirmationMode: detectConfirmation(...sources),
  };
  const check = checkPayload(payload, context);
  const phase2 = writePhase2Report({ product, payload, check, inputs, context });

  console.log(JSON.stringify({
    reportPath: REPORT_PATH,
    selectedProductId: product.bokunActivityId,
    selectedTitle: product.title,
    payloadCompleteness: check.completeness,
    readyForSandboxSubmitTest: phase2.readyForSandboxSubmit,
    mainBlocker: phase2.mainBlocker,
    databaseWrites: false,
    realBookingCreated: false,
  }, null, 2));
}

async function runResolver() {
  const productId = getArgValue('--product-id') || findReadyActivityIdFromReport().activityId;
  const product = await loadProductByActivityId(productId);
  if (!product) throw new Error(`BokunProduct not found for activity ${productId}`);

  const date = getProbeDate();
  const inputs = await fetchProbeInputs(product, date);
  const payload = buildPayload({ product, ...inputs, date });
  const sources = [product.rawJson, inputs.detail.body, inputs.pricing.body, inputs.availabilityGet.body, inputs.availabilityPost.body, inputs.pickupPlaces.body, inputs.questionsEndpoint.body];
  const context = {
    priceSignal: hasPriceSignal(product, ...sources),
    availabilitySignal: hasAvailabilitySignal(...sources),
    confirmationMode: detectConfirmation(...sources),
  };
  const check = checkPayload(payload, context);
  const summary = summarizeProduct(product, inputs, payload, check);
  const candidates = await findBetterCandidates(product.bokunActivityId, 5);
  const resolver = writeResolverReport({ product, summary, candidates, payload, check });
  console.log(JSON.stringify(resolver, null, 2));
}

async function main() {
  if (process.argv.includes('--resolve-fields')) {
    await runResolver();
    return;
  }
  await runPhase2Default();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
