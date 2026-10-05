import type { Skill, SkillCategory, SkillSubcategory } from '@/shared/types'

const BASE_URL = `${import.meta.env.BASE_URL}db`

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(`${BASE_URL}/skills.json`)
  if (!response.ok) throw new Error('Failed to fetch skills')
  return response.json()
}

export async function fetchSkillById(id: string): Promise<Skill | undefined> {
  const skills = await fetchSkills()
  return skills.find((skill) => skill.id === id)
}

// возвращает все навыки указанного пользователя
export async function fetchSkillByUserId(userId: string): Promise<Skill[]> {
  const skills = await fetchSkills()
  return skills.filter((skill) => skill.authorId === userId)
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const response = await fetch(`${BASE_URL}/skillCategories.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch skill categories')
  }

  return response.json()
}

export async function fetchSkillSubcategories(): Promise<SkillSubcategory[]> {
  const response = await fetch(`${BASE_URL}/skillSubcategories.json`)

  if (!response.ok) {
    throw new Error('Failed to fetch skill subcategories')
  }

  return response.json()
}
