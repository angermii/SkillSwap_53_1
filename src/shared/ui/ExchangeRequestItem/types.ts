export type ExchangeRequestItemProps = {
    id: string
    title?: string
    description?: string
    date?: string
    onCancel?: (id: string) => void
}