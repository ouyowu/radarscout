type ConfirmedIntent = {
  destination: string | null
  durationDays: number | null
  duration: string | null
  interests: string[]
  language: string
  confirmedAt: string
}

type LocalConfirmationPanelProps = {
  confirmed: ConfirmedIntent | null
}

type PlannerNotesProps = {
  missingFields: string[]
  warnings: string[]
}

type CapabilityStatusPanelProps = {
  bookingEnabled: boolean
  productRetrievalEnabled: boolean
  availabilityEnabled: boolean
}

type StructuredTripDetailsProps = {
  parsedJson: string
}

function formatValue(value: string | number | null): string {
  if (value === null || value === '') return 'Not detected'
  return String(value)
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'None detected'
}

function formatMissingField(field: string): string {
  if (field === 'durationDays') return 'trip length'
  if (field === 'destination') return 'destination'
  return field
}

function formatPlannerNote(note: string): string {
  if (note === 'empty prompt') return 'Add a trip idea to start planning.'
  if (note === 'prompt truncated') return 'Your trip idea was shortened to fit the planner.'
  if (note === 'ambiguous or missing destination') return 'Add a clearer Thailand destination.'
  if (note === 'ambiguous or missing duration') return 'Add a trip length.'
  return note
}

function CapabilityStatus({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#d8eadf] bg-[#f0fbf5] px-4 py-3 text-sm font-black text-[#0f5132]">
      <span>{label}</span>
      <span>{status}</span>
    </div>
  )
}

export function LocalConfirmationPanel({ confirmed }: LocalConfirmationPanelProps) {
  return (
    <section className="border border-[#cfe8df] bg-white p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
        Local confirmation
      </h3>
      {confirmed ? (
        <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-[#5a6670]">
          <p className="font-black text-[#0f5132]">Trip intent confirmed locally</p>
          <p>Destination: <span className="font-black text-[#101820]">{formatValue(confirmed.destination)}</span></p>
          <p>Duration: <span className="font-black text-[#101820]">{formatValue(confirmed.duration)}</span></p>
          <p>Interests: <span className="font-black text-[#101820]">{formatList(confirmed.interests)}</span></p>
          <p>Language: <span className="font-black text-[#101820]">{confirmed.language}</span></p>
          <p>Local status: <span className="font-black text-[#101820]">Confirmed in this browser session at {confirmed.confirmedAt}</span></p>
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
          Nothing has been confirmed yet. Parse a prompt, then confirm the detected destination and duration in local UI only.
        </p>
      )}
    </section>
  )
}

export function PlannerNotes({ missingFields, warnings }: PlannerNotesProps) {
  const hasMissingFields = missingFields.length > 0
  const hasWarnings = warnings.length > 0
  const formattedMissingFields = missingFields.map(formatMissingField)
  const formattedWarnings = warnings.map(formatPlannerNote)

  return (
    <section className="border border-[#f3d6aa] bg-[#fff8e8] p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#a35c09]">
        Planner notes
      </h3>
      {hasMissingFields || hasWarnings ? (
        <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
          {hasMissingFields ? (
            <p>Add detail: <span className="font-black text-[#101820]">{formattedMissingFields.join(', ')}</span></p>
          ) : null}
          {hasWarnings ? (
            <p>Planning notes: <span className="font-black text-[#101820]">{formattedWarnings.join(', ')}</span></p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
          This trip idea has enough detail for local planning.
        </p>
      )}
    </section>
  )
}

export function CapabilityStatusPanel({
  bookingEnabled,
  productRetrievalEnabled,
  availabilityEnabled,
}: CapabilityStatusPanelProps) {
  return (
    <section className="border border-[#d8eadf] bg-white p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#0f766e]">
        Planner safety status
      </h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
        Product comparison can appear after local confirmation. Current product details and booking partner handoff stay on product pages.
      </p>
      <div className="mt-4 grid gap-3">
        <CapabilityStatus
          label="Product comparison results"
          status={productRetrievalEnabled ? 'Shown' : 'Not shown yet'}
        />
        <CapabilityStatus
          label="Booking partner handoff"
          status={bookingEnabled ? 'Shown' : 'Product page only'}
        />
        <CapabilityStatus
          label="Current product details"
          status={availabilityEnabled ? 'Shown' : 'Product page only'}
        />
      </div>
    </section>
  )
}

export function StructuredTripDetails({ parsedJson }: StructuredTripDetailsProps) {
  return (
    <details className="mt-5 border border-[#e8dfd2] bg-white p-4">
      <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
        Trip details
      </summary>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs font-semibold leading-6 text-[#101820]">
        {parsedJson}
      </pre>
    </details>
  )
}

export type { ConfirmedIntent }
