import { ReactNode } from 'react'

export interface CategorySectionProps {
  icon: ReactNode
  iconColor: string
  category: string
  subCategories: string[]
  onClick?: (subCat: string) => void
}
