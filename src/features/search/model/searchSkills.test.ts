import { describe, expect, it } from 'vitest'
import type { Skill } from '@/entities/skill/model/types'
import { searchSkills } from './searchSkills'

// Создаем полные объекты навыков по существующему типу Skill
const createSkill = (id: string, title: string): Skill => ({
  id,
  title,
  description: '',
  type: 'teach',
  subcategoryId: '',
  imageUrl: null,
  authorId: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
})

const skills = [
  createSkill('skill-1', 'Основы фотографии'),
  createSkill('skill-2', 'Английский язык'),
]

describe('searchSkills', () => {
  it('ищет по части названия без учета регистра', () => {
    expect(searchSkills(skills, 'ФОТО')).toEqual([skills[0]])
  })

  it('возвращает новый результат при изменении запроса', () => {
    const photoResult = searchSkills(skills, 'фото')
    const englishResult = searchSkills(skills, 'английский')

    expect(photoResult).toEqual([skills[0]])
    expect(englishResult).toEqual([skills[1]])
  })

  it('возвращает новый массив со всеми навыками для пустого запроса', () => {
    const result = searchSkills(skills, '   ')

    expect(result).toEqual(skills)
    expect(result).not.toBe(skills)
  })

  it('не изменяет исходный массив навыков', () => {
    const originalSkills = skills.map((skill) => ({ ...skill }))

    searchSkills(skills, 'фото')

    expect(skills).toEqual(originalSkills)
  })
})
