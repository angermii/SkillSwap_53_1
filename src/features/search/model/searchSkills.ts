import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'

export const searchSkills = (
  skills: Skill[],
  query: string,
  users: User[] = [],
): Skill[] => {
  // нормализуем запрос для поиска без учета регистра
  const normalizedQuery = query.trim().toLowerCase()

  // пустой запрос возвращает новый массив со всеми навыками
  if (!normalizedQuery) {
    return [...skills]
  }

  return skills.filter((skill) => {
    // связываем навык с его автором через существующие идентификаторы
    const author = users.find((user) => user.id === skill.authorId)
    const searchableValues = [skill.title, author?.name, author?.city]

    // ищем совпадение хотя бы в одном разрешенном поле
    return searchableValues.some((value) =>
      value?.toLowerCase().includes(normalizedQuery),
    )
  })
}
