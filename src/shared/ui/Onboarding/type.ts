import type { ComponentType, HTMLAttributes, SVGProps } from 'react'

export type OnboardingProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  illustration: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}
