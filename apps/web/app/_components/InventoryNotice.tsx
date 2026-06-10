import { InventoryAlert } from './InventoryAlert'

type InventoryNoticeProps = {
  status: 'live' | 'coming-soon' | 'planning-only'
  destinationName?: string
  className?: string
}

export function InventoryNotice(props: InventoryNoticeProps) {
  return <InventoryAlert {...props} />
}
