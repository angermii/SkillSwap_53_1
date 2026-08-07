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
    // находим навык пользователя
    const skill = skills.find((s) => s.authorId === user.id)

    // если у пользователя нет навыка — пропускаем
    if (!skill) {
      return false
    }

    const searchableValues = [skill.title, user.name, user.city]

    // ищем совпадение хотя бы в одном разрешенном поле
    return searchableValues.some((value) => value?.toLowerCase().includes(normalizedQuery))
  })
}
