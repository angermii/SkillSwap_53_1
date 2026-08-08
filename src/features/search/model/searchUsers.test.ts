import { describe, expect, it } from 'vitest'
import type { Skill } from '@/entities/skill/model/types'
import type { User } from '@/entities/user/model/types'
import { searchUsers } from './searchUsers'

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

describe('searchUsers', () => {
  it('ищет по части названия без учета регистра', () => {
    expect(searchUsers(skills, 'ФОТО', users)).toEqual([users[0]])
  })

  it('возвращает новый результат при изменении запроса', () => {
    const photoResult = searchUsers(skills, 'фото', users)
    const englishResult = searchUsers(skills, 'английский', users)

    expect(photoResult).toEqual([users[0]])
    expect(englishResult).toEqual([users[1]])
  })

  it('возвращает новый массив со всеми пользователями для пустого запроса', () => {
    const result = searchUsers(skills, '   ', users)

    expect(result).toEqual(users)
    expect(result).not.toBe(users)
  })

  it('не изменяет исходный массив навыков', () => {
    const originalSkills = skills.map((skill) => ({ ...skill }))
    const originalUsers = users.map((user) => ({ ...user }))

    searchUsers(skills, 'фото', users)

    expect(skills).toEqual(originalSkills)
    expect(users).toEqual(originalUsers)
  })

  it('ищет по имени пользователя без учёта регистра', () => {
    expect(searchUsers(skills, 'СМИРНОВА', users)).toEqual([users[0]])
  })

  it('ищет по городу без учёта регистра', () => {
    expect(searchUsers(skills, 'КАЗ', users)).toEqual([users[1]])
  })
})
