import { describe, expect, it } from 'vitest'
import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import { searchSkills } from './searchSkills'

// создаем полные объекты по существующим типам Skill и User
const createSkill = (id: string, title: string, authorId: string): Skill => ({
  id,
  title,
  description: '',
  type: 'teach',
  subcategoryId: '',
  imageUrl: null,
  authorId,
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
})

const createUser = (id: string, name: string, city: string): User => ({
  id,
  name,
  city,
  email: '',
  avatarUrl: null,
  gender: 'female',
  age: 25,
  description: '',
  createdAt: '2026-01-01T00:00:00.000Z',
})

const skills = [
  createSkill('skill-1', 'Основы фотографии', 'user-1'),
  createSkill('skill-2', 'Английский язык', 'user-2'),
]

const users = [
  createUser('user-1', 'Анна Смирнова', 'Москва'),
  createUser('user-2', 'Борис Петров', 'Казань'),
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

  it('ищет по имени пользователя без учёта регистра', () => {
    expect(searchSkills(skills, 'СМИРНОВА', users)).toEqual([skills[0]])
  })

  it('ищет по городу без учёта регистра', () => {
    expect(searchSkills(skills, 'КАЗ', users)).toEqual([skills[1]])
  })
})
