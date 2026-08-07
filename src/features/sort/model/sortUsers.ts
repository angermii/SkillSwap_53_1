import type { Skill, User } from '@/shared/types'

// тип сортировки: популярность, дата, рекомендации
export type SortType = 'popularity' | 'date' | 'recommendations'

// тип для направления даты
export type DateOrder = 'newest' | 'oldest'

// сортировка по популярности: по убыванию лайков
export const sortByPopularity = (users: User[], skillByAuthorId: Map<string, Skill>): User[] => {
  return [...users].sort((a, b) => {
    const aLikes = skillByAuthorId.get(a.id)?.likeCount ?? 0
    const bLikes = skillByAuthorId.get(b.id)?.likeCount ?? 0

    return bLikes - aLikes
  })
}

// сортировка по дате: по умолчанию сначала новые, направление можно менять
export const sortByDate = (users: User[], order: DateOrder = 'newest'): User[] => {
  return [...users].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()

    if (order === 'oldest') {
      return aTime - bTime // сначала старые
    }
    return bTime - aTime // сначала новые
  })
}

// рекомендуемое: рандом
export const sortByRecommendations = (users: User[]): User[] => {
  return [...users].sort(() => Math.random() - 0.5)
}

// главная функция сортировки, выбирает кейс по типу сортировки
export const sortUsers = (
  users: User[],
  skills: Skill[],
  sortType: SortType,
  dateOrder: DateOrder = 'newest',
): User[] => {
  // собираем навыки по пользователям один раз для быстрого доступа
  const skillByAuthorId = new Map<string, Skill>()
  skills.forEach((skill) => {
    skillByAuthorId.set(skill.authorId, skill)
  })

  switch (sortType) {
    case 'popularity':
      return sortByPopularity(users, skillByAuthorId)
    case 'date':
      return sortByDate(users, dateOrder)
    case 'recommendations':
      return sortByRecommendations(users)
  }
}
