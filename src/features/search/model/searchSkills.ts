import type { Skill } from '@/entities/skill/model/types'

export const searchSkills = (skills: Skill[], query: string): Skill[] => {
  // нормализуем запрос для поиска без учета регистра
  const normalizedQuery = query.trim().toLowerCase()

  // пустой запрос возвращает новый массив со всеми навыками
  if (!normalizedQuery) {
    return [...skills]
  }

  // filter не изменяет исходный массив
  return skills.filter((skill) => skill.title.toLowerCase().includes(normalizedQuery))
}
