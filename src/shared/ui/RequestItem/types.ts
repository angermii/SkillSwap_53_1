export type RequestItemProps = {
  id: string
  title?: string
  description?: string
  date?: string
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onClick?: (id: string) => void
}