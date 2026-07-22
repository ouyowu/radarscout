export function addDaysToIsoDate(checkIn: string, days: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !Number.isInteger(days) || days < 1) return ''
  const date = new Date(`${checkIn}T00:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== checkIn) return ''
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
