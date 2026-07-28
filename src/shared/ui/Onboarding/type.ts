import type { HTMLAttributes, ReactElement } from 'react'

export type OnboardingProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  illustration: ReactElement
  title: string
  description: string
}
