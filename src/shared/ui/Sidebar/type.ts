import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import type { To } from 'react-router-dom'

export interface SidebarItem {
  id: string
  label: string
  icon: ReactNode
  to: To
  end?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  items: SidebarItem[]
  ariaLabel?: string
}
