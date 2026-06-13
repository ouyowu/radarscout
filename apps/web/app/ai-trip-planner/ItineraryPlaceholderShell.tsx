type ItineraryPlaceholderShellProps = {
  durationDays: number
  placeholderDayCount: number
}

export function ItineraryPlaceholderShell({
  durationDays,
  placeholderDayCount,
}: ItineraryPlaceholderShellProps) {
  return (
    <section className="mt-5 border border-[#ded7ca] bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a35c09]">
            Placeholder only
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#101820]">
            Itinerary planning shell
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#5a6670]">
          Placeholder days are based only on the confirmed duration.
        </p>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-[#5a6670]">
        This is a planning shell, not a generated itinerary. No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.
      </p>

      {durationDays > 7 ? (
        <p className="mt-3 text-sm font-semibold leading-6 text-[#a35c09]">
          Only the first 7 placeholder days are shown in this preview.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="border border-[#d8eadf] bg-[#f5fbf7] p-4">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
            What happens next
          </h4>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
            Next step later: connect a safe itinerary generator after intent confirmation.
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
            Until then, this section only reserves generic planning space for future itinerary output.
          </p>
          <div className="mt-4">
            <button
              type="button"
              disabled
              className="inline-flex min-h-[52px] items-center justify-center border border-[#c7beb1] bg-[#f7f3ea] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#9a9084] disabled:cursor-not-allowed"
            >
              Generate itinerary — coming later
            </button>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
              This button is disabled until a safe itinerary generator is implemented.
            </p>
          </div>
        </section>

        <section className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
          <h4 className="text-sm font-black uppercase tracking-[0.12em] text-[#a35c09]">
            Not yet connected
          </h4>
          <div className="mt-3 grid gap-2 text-sm font-semibold leading-6 text-[#5a6670]">
            <p>Product search: <span className="font-black text-[#101820]">not connected</span></p>
            <p>Supplier data: <span className="font-black text-[#101820]">not connected</span></p>
            <p>Availability: <span className="font-black text-[#101820]">not connected</span></p>
            <p>Pricing: <span className="font-black text-[#101820]">not connected</span></p>
            <p>Checkout: <span className="font-black text-[#101820]">not connected</span></p>
            <p>Booking: <span className="font-black text-[#101820]">not connected</span></p>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: placeholderDayCount }, (_, index) => (
          <article key={index} className="border border-[#e8dfd2] bg-[#fffdf7] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#a35c09]">
              Day {index + 1} placeholder
            </p>
            <h4 className="mt-2 text-lg font-black text-[#101820]">
              Planning slot placeholder
            </h4>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
              Experience slots will appear here after itinerary generation is implemented.
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
              No tours, suppliers, prices, availability, checkout, payment, or booking links are loaded.
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
