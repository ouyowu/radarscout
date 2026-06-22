# RadarScout 项目接管说明与后续执行指令

> 面向 Codex 的完整项目交接文档  
> 当前项目：RadarScout Thailand Travel AI  
> 仓库：`ouyowu/radarscout`  
> 主开发分支：`codex/travel-mvp-launch`  
> 文档目的：让 Codex 在不依赖此前聊天记录的情况下，无缝继续开发、审查、测试和提交 PR。

---

## 1. 项目定位

RadarScout 是一个面向泰国旅游市场的 AI 搜索、真实产品匹配和行程生成平台。

它的核心价值不是重做交易系统，而是：

- AI 搜索
- 旅行意图理解
- 行程草案生成
- 已签约真实产品匹配
- RAG
- 利润筛选与 guardrail
- OTA observed price comparison
- SEO 流量入口
- 生成式 UI
- 将真实旅游产品组织成可预订行程

---

## 2. 与 Bókun 的边界

Bókun 作为底层交易与供应链系统，负责：

- booking widget
- checkout
- payment
- availability
- 库存同步
- 渠道管理
- 合同
- commission / payment terms
- pricing tools
- API / Webhooks / OCTO
- booking confirmation

RadarScout 不重复开发：

- booking checkout
- payment
- availability
- inventory
- channel management
- booking confirmation
- supplier contract settlement
- commission settlement

公开文案禁止使用：

- Bókun database
- Bókun backend
- Bókun-powered
- Bókun supplier products
- powered by Bókun

推荐公开文案：

- booking partner
- trusted operators
- real local experiences
- partner-direct value
- secure booking handoff
- bookable itinerary
- check availability
- view experience

正确公开流程：

```text
AI 推荐真实产品
→ 用户查看产品详情
→ 点击 View experience / Check availability
→ 进入官方 booking widget 或 booking handoff
→ Bókun 完成日期、人数、extras、支付、确认和库存同步
```

---

## 3. 全局安全规则

除非用户明确批准，否则禁止：

- 生产部署
- migration
- Prisma schema change
- production DB write
- production env change
- 启用 `PRODUCT_ISSUE_FLAGS_ENABLED`
- Bókun API 调用
- Bókun sync
- 外部 LLM 调用
- 添加 booking / availability / checkout / payment / inventory
- 输出 secrets
- 输出 raw env values
- 输出 rawJson
- 输出 provider raw output
- 输出系统 prompt
- 输出 provider / model / token usage
- 输出 supplier ID、commission、settlement price、payment terms
- 输出内部 eligibility reasons

默认原则：

- fail closed
- server-side re-derive
- 不信任客户端 product context
- 不信任 provider 输出
- 所有真实产品必须先经过 Thailand eligibility
- 所有公开产品字段必须来自 public-safe context

---

## 4. 已完成并合并的主要工作

### PR #64

内容：

- AI draft 阻止非泰国和 destination mismatch

状态：已合并

### PR #65

内容：Thailand-only public APIs

merge commit：

```text
82a2d27c8ddf9557e3a3270104e50e1f8cc8aa88
```

部署：TD-DEPLOY-22

### PR #66

内容：

- Thailand SEO
- sitemap
- blocked product noindex
- eligible product canonical / product metadata

merge commit：

```text
a8a6cafc15ce234797a5e9877d4f14f57fde7f5b
```

部署：

- TD-DEPLOY-23
- `dpl_3Fnd7mWCs66oa4BVQPovrESj8oKy`

### PR #67

内容：AI RAG guardrails

merge commit：

```text
46f38e500b178b70af54af1364c60b6a7c0e44ad
```

### PR #68

标题：`Connect AI Trip Planner to real Thailand product search`

内容：

- `/api/ai-trip/search`
- deterministic parser
- Thailand-only guard
- real product retrieval
- no LLM
- no booking
- no availability
- public-safe product cards
- `PARSER_PROMPT_LIMIT = 600`

merge commit：

```text
92052517e7de513e0c63e99753809bfb344571d4
```

部署：

- TD-DEPLOY-24
- `dpl_8FK5bkALWnbL6WEZDHXja4sqgn1J`

### PR #69

标题：`Batch reviewed enrichment and add AI search E2E coverage`

内容：

- 修复 reviewed-enrichment N+1
- eligibility-before-enrichment
- batch enrichment
- safe telemetry
- corrected `fallbackUsed`
- 删除危险 Promise.race timeout
- 增加 Playwright E2E
- Singapore / mixed destination 强制完整 UI 流程
- exactly-one API request assertion

merged head：

```text
ddc926b7d086de7c2d129928a8ce8584fe7ae640
```

merge commit：

```text
a1f8c33a73faf933cea739224f101006a2972ebf
```

部署：

- TD-DEPLOY-25
- `dpl_5ZWAWTDdBmgjhYu9KanyHSRKGWkx`
- production aliases：`https://radarscout.io`、`https://www.radarscout.io`

生产性能观测：

- first-observed：约 5.55 s
- warm repeat：约 3.67 s

测试：

- Focused Vitest：217 / 217
- Full Vitest：734 / 734
- Playwright：18 / 18
- TypeScript：clean

限制：未完成 live browser click-through，但 API + Playwright 已覆盖，属于 non-blocking limitation。

---

## 5. 当前生产状态

```text
branch: codex/travel-mvp-launch
commit: a1f8c33a73faf933cea739224f101006a2972ebf
```

当前生产能力：

- Thailand-only trip intent parsing
- real Thailand product retrieval
- eligibility enforcement
- reviewed enrichment
- batch enrichment
- public-safe product context
- AI trip search UI
- product cards
- SEO
- blocked product safeguards
- internal route protections
- no live LLM itinerary generation
- no booking
- no availability
- no checkout
- no payment

---

## 6. 当前正在开发的分支

```text
branch: codex/td-ai-itinerary-7
base: codex/travel-mvp-launch
latest known commit: 3c6b529
```

注意：

- 尚未创建 PR
- 不要直接部署
- 不要合并
- 不要接真实 LLM

---

## 7. 当前 itinerary draft 架构

```text
parseTripIntent
→ isThailandCompatibleDestination
→ listAiEligibleThailandProducts
→ buildAiProductContext
→ buildItineraryDraftInput
→ ItineraryDraftProvider.generate
→ validateItineraryDraftOutput
→ ItineraryDraftResponse
```

schema version：

```text
itinerary-draft-v1
```

feature flag：

```text
AI_ITINERARY_DRAFT_ENABLED
```

规则：

- absent = false
- default false
- production 未启用
- flag 关闭时 API 返回 disabled
- 当前仅使用 mock provider 进行测试
- 不允许真实外部模型调用

---

## 8. 当前已实现的 itinerary 安全能力

### Strict schema

Root allowed keys：destination, durationDays, summary, days, warnings  
Day allowed keys：day, title, theme, items  
Item allowed keys：type, productId, title, description, timeOfDay

未知字段返回：`UNKNOWN_FIELD`

### Destination match

规则：trim + collapse whitespace + lowercase。  
不匹配返回：`DESTINATION_MISMATCH`

### Product reference

- experience 必须有 productId
- productId 必须属于 allowedProducts
- non-experience 不得带 productId
- 不得重复引用产品
- 成功响应只返回 itinerary 实际引用的 products
- 返回顺序按首次引用顺序

### Forbidden claims

已拒绝：价格、折扣、评分、评论数、availability、live inventory、booking confirmed、checkout、payment、supplier net rate、commission、partner rate、opening hours、meeting point、pickup included、transfer included、guaranteed transfer 等。

允许：generic transfer note、morning/afternoon、Allow time to travel between activities、Plan local transport separately。

---

## 9. 当前仍未解决的两个最终阻塞项

### 阻塞项 A：生产运行时默认使用 Mock Provider

当前危险模式：

```ts
let _provider = new MockItineraryDraftProvider()
```

风险：误启用 feature flag 后，生产 API 会返回 mock itinerary。

正确行为：

- 默认 runtime provider 不可用
- mock 只允许测试显式注入
- flag false → disabled
- flag true + no provider → generation_failed
- 生产不能返回 mock itinerary

推荐结构：

```ts
let providerOverrideForTest: ItineraryDraftProvider | null = null

function getItineraryDraftProvider(): ItineraryDraftProvider {
  if (providerOverrideForTest) return providerOverrideForTest
  throw new ItineraryProviderUnavailableError()
}

export function _setProviderForTest(provider: ItineraryDraftProvider) {
  providerOverrideForTest = provider
}

export function _resetProviderForTest() {
  providerOverrideForTest = null
}
```

测试必须在 `afterEach` 重置 override。

### 阻塞项 B：合法 productId 仍可携带虚构 title / description

风险示例：

```json
{
  "type": "experience",
  "productId": "真实产品ID",
  "title": "Private Helicopter Flight",
  "description": "Fly over Chiang Mai by helicopter."
}
```

v1 正确策略：

- provider 只选择 productId 和 timeOfDay
- 先完整验证 provider 原始输出
- 再由服务器 hydration：
  - title = allowed product public title
  - description = allowed product public summary
  - summary 为空则使用 `View this experience for verified details.`
- provider 原始 experience title / description 不得进入公开响应

正确顺序：

```text
1. strict schema
2. duration match
3. destination match
4. product ID validation
5. duplicate validation
6. forbidden claim scan on raw provider text
7. server hydration
8. referenced product extraction
9. return hydrated itinerary
```

---

## 10. Codex 的下一步唯一任务

任务名：

```text
TD-AI-ITINERARY-7-FINAL-REVIEW-FIX
```

目标：

- 移除 runtime mock default
- 增加 provider unavailable fail-closed
- 增加 test provider reset
- server hydrate experience title/description
- 保持现有所有 guardrails
- 完成测试前不创建 PR
- 不部署
- 不接真实模型

---

## 11. 给 Codex 的完整执行指令

启动：

```bash
git checkout codex/td-ai-itinerary-7
git pull origin codex/td-ai-itinerary-7
git status
git rev-parse HEAD
```

读取：

- `CLAUDE.md`
- `AGENTS.md`
- `docs/deployment.md`
- `apps/web/lib/featureFlags.ts`
- `apps/web/lib/aiProducts/itineraryDraftSchema.ts`
- `apps/web/lib/aiProducts/itineraryDraftValidator.ts`
- `apps/web/lib/aiProducts/itineraryDraftProvider.ts`
- `apps/web/lib/aiProducts/itineraryDraftInputBuilder.ts`
- `apps/web/app/api/ai-trip/itinerary-draft/route.ts`
- itinerary tests
- route tests
- UI tests

### 修改 1：移除 runtime mock default

不要再使用：

```ts
let _provider = new MockItineraryDraftProvider()
```

改为 test-only override + unavailable error。正常 runtime 无 provider 时必须返回安全 `generation_failed`。

### 修改 2：server hydrate experience facts

建议新增纯函数：

```ts
hydrateItineraryExperienceFacts({ draft, allowedProducts })
```

要求：

- 返回新对象
- 不 mutate draft
- 不 mutate allowedProducts
- experience title 使用 allowedProduct.title
- experience description 使用 allowedProduct.summary 或安全 fallback
- non-experience 保留 provider 原文
- hydration 必须在完整 validation 之后

### 修改 3：增加测试

Provider runtime：

- flag true + no provider → generation_failed
- normal runtime 不产生 mock 内容
- explicit test injection → ok
- reset helper 清除 override
- override 不跨测试泄露
- unavailable response 无 provider/model/prompt/raw output metadata

Hydration：

- helicopter hallucination 被 canonical product facts 替换
- null summary 使用 fallback
- 两个产品分别 hydrate
- non-experience 保持原文
- unknown ID 失败
- duplicate ID 失败
- forbidden provider text 在 hydration 前失败
- raw provider title / description 不进入响应
- referenced products 顺序不变

---

## 12. 测试要求

```bash
pnpm --filter @reddit-monitor/db exec prisma generate
pnpm --filter @reddit-monitor/web test -- itineraryDraftProvider
pnpm --filter @reddit-monitor/web test -- itineraryDraftSchema
pnpm --filter @reddit-monitor/web test -- itineraryDraftValidator
pnpm --filter @reddit-monitor/web test -- itinerary-draft
pnpm --filter @reddit-monitor/web test -- itineraryDraftUi
pnpm --filter @reddit-monitor/web test
pnpm --filter @reddit-monitor/web test:e2e
pnpm --filter @reddit-monitor/web exec tsc --noEmit
```

---

## 13. 完成标准

- runtime 默认不再使用 mock
- flag true + no provider → safe generation_failed
- mock 只能 test injection
- test override 可 reset
- provider 原始 experience title/description 不公开
- canonical title/description 来自 public-safe allowedProducts
- null summary 使用安全 fallback
- forbidden raw output 在 hydration 前失败
- only referenced products 返回
- no raw output
- no prompt/model/token metadata
- no deploy
- no real LLM
- no migration/schema/env/DB write
- no Bókun operation
- no booking/availability/checkout/payment

---

## 14. 完成后报告模板

```text
Final Report — TD-AI-ITINERARY-7-FINAL-REVIEW-FIX

Branch:
Commit SHA:
Base:
PR opened: no

Runtime provider behavior:
- flag false:
- flag true + no provider:
- explicit test provider:
- reset behavior:

Hydration:
- canonical title source:
- canonical description source:
- null-summary fallback:
- mutation behavior:
- hydration order:

Hallucination test:
- provider raw title:
- provider raw description:
- public returned title:
- public returned description:
- raw hallucinated text absent:

Tests:
- focused:
- full Vitest:
- Playwright:
- TypeScript:
- prisma generate:

Confirmations:
- no real LLM
- no deploy
- no migration
- no schema change
- no env change
- no production DB write
- no Bókun API
- no booking / availability / checkout / payment

Blockers:
```

---

## 15. PR 创建规则

完成最终修复并通过全部测试之前：

```text
不要创建 PR
不要部署
不要接真实模型
```

通过后才创建：

```text
head: codex/td-ai-itinerary-7
base: codex/travel-mvp-launch
```

建议标题：

```text
Add guarded Thailand itinerary draft engine
```

---

## 16. 后续路线图

### TD-AI-ITINERARY-8

当前分支合并后才开始：

- 真实 provider adapter
- JSON/schema constrained output
- token budget
- retry strategy
- safe timeout
- provider telemetry
- cost guardrail
- feature flag 默认 false
- preview-only
- 不开放 production

### 再下一阶段

- preview deployment
- test-only flag enable
- real provider smoke
- adversarial prompt tests
- production rollout review
- 仍不接 booking/availability

---

## 17. Codex 第一条任务

```text
Read the repository instructions and this handoff document completely.

Continue only on branch codex/td-ai-itinerary-7.

Implement TD-AI-ITINERARY-7-FINAL-REVIEW-FIX exactly as specified.

Do not open a PR, do not deploy, and do not add or call a real LLM.

Your first response must summarize:
1. current branch and commit,
2. the two remaining blockers,
3. exact files you will inspect,
4. exact tests you will run,
5. confirmation that no production side effects will occur.

Then begin the implementation.
```
