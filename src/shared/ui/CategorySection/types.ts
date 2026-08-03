import { ReactNode } from 'react'

export interface Props {
  icon: ReactNode
  iconColor: string
  category: string
  subCategories: string[]
  onClick?: (subCat: string) => void
}
