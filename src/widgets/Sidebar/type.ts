import type { HTMLAttributes, ReactNode } from 'react'

export interface SidebarItem<Id extends string = string> {
  id: Id
  label: string
  icon: ReactNode
}

export interface SidebarProps<Id extends string = string> extends Omit<
  HTMLAttributes<HTMLElement>,
  'onSelect'
> {
  items: SidebarItem<Id>[]
  activeId: Id
  onSelect: (id: Id) => void
  ariaLabel?: string
}
