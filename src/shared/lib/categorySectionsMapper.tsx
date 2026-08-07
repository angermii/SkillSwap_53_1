import type { SkillCategory, SkillSubcategory } from '@/shared/types'
import type { CategorySectionProps } from '@/shared/ui'

import {
  CategoryArtIcon,
  CategoryBusinessIcon,
  CategoryEducationIcon,
  CategoryHealthIcon,
  CategoryHomeIcon,
  CategoryLanguagesIcon,
} from '@/shared/ui/icons'

// Соответствие идентификаторов категорий и их иконок
const iconMap = {
  business: CategoryBusinessIcon,
  languages: CategoryLanguagesIcon,
  home: CategoryHomeIcon,
  creativity: CategoryArtIcon,
  education: CategoryEducationIcon,
  health: CategoryHealthIcon,
} as const

// Соответствие идентификаторов категорий и цветов подложек
const colorMap = {
  business: 'purple',
  languages: 'yellow',
  home: 'peach',
  creativity: 'pink',
  education: 'blue',
  health: 'green',
} as const

// Преобразует категории и подкатегории в формат, необходимый компоненту CategoryMenu для соответствия типов
export const mapCategoriesToSections = (
  categories: SkillCategory[],
  subCategories: SkillSubcategory[],
): CategorySectionProps[] => {
  return categories.map((category) => {
    const Icon = iconMap[category.id as keyof typeof iconMap]
    const iconColor = colorMap[category.id as keyof typeof colorMap]

    return {
      icon: <Icon />,
      iconColor,
      category: category.title,
      subCategories: subCategories
        .filter((subCategory) => subCategory.categoryId === category.id)
        .map((subCategory) => subCategory.title),
    }
  })
}
