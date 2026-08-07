import type { SkillType, User } from '@/shared/types'

export type SkillTypeFilter = SkillType | 'all'
export type GenderFilter = User['gender'] | 'all'

export type UserFilters = {
  skillType: SkillTypeFilter
  categoryIds: string[]
  subcategoryIds: string[]
  gender: GenderFilter
  cities: string[]
}

// создаёт начальное состояние фильтров для инициализации и сбросе
export const createInitialFilters = (): UserFilters => ({
  skillType: 'all',
  categoryIds: [],
  subcategoryIds: [],
  gender: 'all',
  cities: [],
})
