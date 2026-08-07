import type { Skill } from '@/shared/types'

// тип сортировки: популярность, дата, рекомендации
export type SortType = 'popularity' | 'date' | 'recommendations'

// тип для направления даты
export type DateOrder = 'newest' | 'oldest'

// сортировка по популярности: по убыванию лайков
export const sortByPopularity = (skills: Skill[]): Skill[] => {
  return [...skills].sort((a, b) => b.likeCount - a.likeCount)
}

// сортировка по дате: по умолчанию сначала новые, направление можно менять
export const sortByDate = (skills: Skill[], order: DateOrder = 'newest'): Skill[] => {
  return [...skills].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()

    if (order === 'oldest') {
      return aTime - bTime // сначала старые
    }

    return bTime - aTime // сначала новые
  })
}

// рекомендуемое: рандом
export const sortByRecommendations = (skills: Skill[]): Skill[] => {
  return [...skills].sort(() => Math.random() - 0.5)
}
