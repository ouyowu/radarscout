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

type MissingFieldsWarningsProps = {
  missingFields: string[]
  warnings: string[]
}

type CapabilityStatusPanelProps = {
  bookingEnabled: boolean
  productRetrievalEnabled: boolean
  availabilityEnabled: boolean
}

type RawJsonDetailsProps = {
  parsedJson: string
}

function formatValue(value: string | number | null): string {
  if (value === null || value === '') return 'Not detected'
  return String(value)
}

function formatList(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'None detected'
}

function CapabilityStatus({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[#d8eadf] bg-[#f0fbf5] px-4 py-3 text-sm font-black text-[#0f5132]">
      <span>{label}</span>
      <span>{enabled ? 'true' : 'false'}</span>
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

export function MissingFieldsWarnings({ missingFields, warnings }: MissingFieldsWarningsProps) {
  const hasMissingFields = missingFields.length > 0
  const hasWarnings = warnings.length > 0

  return (
    <section className="border border-[#f3d6aa] bg-[#fff8e8] p-4">
      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[#a35c09]">
        Missing fields / warnings
      </h3>
      {hasMissingFields || hasWarnings ? (
        <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
          {hasMissingFields ? (
            <p>Missing fields: <span className="font-black text-[#101820]">{missingFields.join(', ')}</span></p>
          ) : null}
          {hasWarnings ? (
            <p>Warnings: <span className="font-black text-[#101820]">{warnings.join(', ')}</span></p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold leading-6 text-[#6b5d4d]">
          No missing required fields or parser warnings detected.
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
        Capability status
      </h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#5a6670]">
        Disabled means this preview is not searching products, checking availability, showing prices, or creating bookings.
      </p>
      <div className="mt-4 grid gap-3">
        <CapabilityStatus label="bookingEnabled" enabled={bookingEnabled} />
        <CapabilityStatus label="productRetrievalEnabled" enabled={productRetrievalEnabled} />
        <CapabilityStatus label="availabilityEnabled" enabled={availabilityEnabled} />
      </div>
    </section>
  )
}

export function RawJsonDetails({ parsedJson }: RawJsonDetailsProps) {
  return (
    <details className="mt-5 border border-[#e8dfd2] bg-white p-4">
      <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.12em] text-[#5a5147]">
        Raw structured JSON
      </summary>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs font-semibold leading-6 text-[#101820]">
        {parsedJson}
      </pre>
    </details>
  )
}

export type { ConfirmedIntent }
