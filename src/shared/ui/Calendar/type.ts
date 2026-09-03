export type CalendarProps = {
  selected?: Date
  onSelect: (date: Date | undefined) => void
  defaultMonth?: Date
  fromYear?: number
  toYear?: number
  className?: string
}
