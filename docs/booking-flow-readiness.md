# Booking Flow Readiness

## Current Status

The current safe product experience is display-only:

- `/tours` lists Bókun-sourced tour products.
- `/tours/[id]` shows tour detail information.
- Booking is handled manually through a `mailto:` CTA.
- No availability check is enabled.
- No booking inquiry submission is enabled.
- No payment flow is enabled.
- No real booking or Bókun order is created.

This keeps the public tour experience limited to browsing and manual inquiry while the booking workflow is reviewed.

## Why Booking Flow Is Not Enabled Yet

The booking flow is intentionally frozen because it depends on several pieces that need production confirmation:

- `BookingForm` depends on `/api/bokun/availability`.
- `BookingForm` depends on `/api/booking-inquiries`.
- Booking inquiry submission writes `BookingInquiry` database records.
- Booking inquiry submission may send Resend emails.
- Redis rate limit behavior needs production confirmation.
- The `BookingInquiry` table must exist in the production database.
- The `/admin/inquiries/{id}` link in email may require a protected admin page.
- The availability helper in `apps/web/lib/bokun.ts` is not committed yet.
- Supplier agreement and manual handling workflow must be confirmed before accepting inquiries.

Until those conditions are met, the site must not present the booking form as an active production workflow.

## Files Intentionally Not Committed

The following files or diffs are intentionally excluded from the current safe display-only tour release:

- `apps/web/app/tours/[id]/BookingForm.tsx`
- `apps/web/app/tours/[id]/BookingInquiryForm.tsx`
- `apps/web/app/api/bokun/availability/route.ts`
- `apps/web/app/api/booking-inquiries/route.ts`
- `apps/web/app/booking/confirmation/page.tsx`
- `apps/web/lib/bokunAvailability.ts`
- `apps/web/lib/bokun.ts` availability helper diff

These files should be reviewed and committed separately only after the enabling conditions below are satisfied.

## Conditions Before Enabling

Before enabling the booking inquiry flow, confirm all of the following:

- Confirm the `BookingInquiry` Prisma model exists in the production database.
- Confirm the required migration has been applied.
- Confirm Resend environment variables are configured.
- Confirm Redis environment variables and fallback behavior.
- Confirm the admin inquiry page exists, or remove the admin link from email.
- Add rate limiting to `/api/bokun/availability`.
- Decide the final form implementation: `BookingForm` or `BookingInquiryForm`, not both.
- Confirm the flow is inquiry-only, with no payment and no real Bókun order creation.
- Add failure fallback behavior for email and API errors.
- Test the full flow in staging before production use.

## Future Commit Plan

- Commit 7A: Availability API helper
- Commit 7B: Booking inquiry API and database write
- Commit 7C: Booking form UI integration
- Commit 7D: Confirmation page and email polish

Each commit should be reviewed independently and must preserve the business boundary: bookable products come only from signed Bókun supplier partners.
