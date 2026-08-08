import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'

export const searchUsers = (skills: Skill[], query: string, users: User[] = []): User[] => {
  // нормализуем запрос для поиска без учета регистра
  const normalizedQuery = query.trim().toLowerCase()

  // пустой запрос возвращает новый массив пользователей
  if (!normalizedQuery) {
    return [...users]
  }

  return users.filter((user) => {
    const userSkills = skills.filter((s) => s.authorId === user.id)
    if (userSkills.length === 0) {
      return false
    }
    const searchableValues = [user.name, user.city, ...userSkills.map((skill) => skill.title)]
    return searchableValues.some((value) => value?.toLowerCase().includes(normalizedQuery))
  })
}
