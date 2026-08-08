import type { Skill, SkillSubcategory, User } from '@/shared/types'

import type { UserFilters } from './types'

export type FilterUsersParams = {
  users: User[]
  skills: Skill[]
  subcategories: SkillSubcategory[]
  filters: UserFilters
}

export const filterUsers = ({
  users,
  skills,
  subcategories,
  filters,
}: FilterUsersParams): User[] => {
  const selectedCities = new Set(filters.cities)
  const selectedCategoryIds = new Set(filters.categoryIds)
  const selectedSubcategoryIds = new Set(filters.subcategoryIds)

  // позволяет определить категорию навыка по ID подкатегории в нём
  const subcategoryById = new Map(subcategories.map((subcategory) => [subcategory.id, subcategory]))

  // собираем навыки по пользователям один раз, чтобы не фильтровать массив для каждой карточки
  const skillsByAuthorId = new Map<string, Skill[]>()

  skills.forEach((skill) => {
    const authorSkills = skillsByAuthorId.get(skill.authorId)

    if (authorSkills) {
      authorSkills.push(skill)
    } else {
      skillsByAuthorId.set(skill.authorId, [skill])
    }
  })

  const hasTaxonomyFilters = selectedCategoryIds.size > 0 || selectedSubcategoryIds.size > 0

  const hasSkillFilters = filters.skillType !== 'all' || hasTaxonomyFilters

  return users.filter((user) => {
    // по полу
    if (filters.gender !== 'all' && user.gender !== filters.gender) {
      return false
    }

    // по городу
    if (selectedCities.size > 0 && !selectedCities.has(user.city)) {
      return false
    }

    // если фильтры по навыкам не выбраны, то проверки по полу и городу достаточно
    if (!hasSkillFilters) {
      return true
    }

    const userSkills = skillsByAuthorId.get(user.id) ?? []

    return userSkills.some((skill) => {
      // по типу навыка (teach или learn)
      if (filters.skillType !== 'all' && skill.type !== filters.skillType) {
        return false
      }

      // если категория и подкатегория не выбраны, то достаточно совпадения по типу навыка
      if (!hasTaxonomyFilters) {
        return true
      }

      // по подкатегории
      if (selectedSubcategoryIds.has(skill.subcategoryId)) {
        return true
      }

      // по категории
      const subcategory = subcategoryById.get(skill.subcategoryId)

      return Boolean(subcategory && selectedCategoryIds.has(subcategory.categoryId))
    })
  })
}
