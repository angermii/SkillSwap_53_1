import type { HTMLAttributes, ReactNode } from 'react'
export type HeadlineTag = 'h1' | 'h2' | 'h3'

export type HeadlineProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: ReactNode
  as?: HeadlineTag
  action?: ReactNode
  titleClassName?: string
  actionClassName?: string
}
