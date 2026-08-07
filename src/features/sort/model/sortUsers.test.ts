import { describe, test, expect } from 'vitest'
import type { Skill, User } from '@/shared/types'
import { sortByPopularity, sortByDate, sortByRecommendations, sortUsers } from './sortUsers'

describe('sortUsers', () => {
  const mockUsers: User[] = [
    {
      id: 'user-001',
      name: 'Анна',
      email: 'anna.smirnova@example.com',
      avatarUrl: '/images/users/user-1.jpg',
      gender: 'female',
      age: 27,
      city: 'Москва',
      description: 'Люблю фотографию и путешествия. Постоянно изучаю новые творческие направления.',
      createdAt: '2026-01-10T09:00:00Z',
    },
    {
      id: 'user-002',
      name: 'Иван',
      email: 'ivan.petrov@example.com',
      avatarUrl: '/images/users/user-2.jpg',
      gender: 'male',
      age: 31,
      city: 'Санкт-Петербург',
      description: 'Работаю в IT, интересуюсь английским языком и переговорами.',
      createdAt: '2026-01-11T10:30:00Z',
    },
    {
      id: 'user-003',
      name: 'Мария',
      email: 'maria.ivanova@example.com',
      avatarUrl: '/images/users/user-3.jpg',
      gender: 'female',
      age: 24,
      city: 'Казань',
      description: 'Изучаю иностранные языки и люблю читать книги.',
      createdAt: '2026-01-12T12:15:00Z',
    },
  ]
  const mockSkills: Skill[] = [
    {
      id: 'skill-001',
      title: 'Основы фотографии',
      description:
        'Научу работать с композицией, светом и настройками камеры. Подойдёт для начинающих.',
      type: 'teach',
      subcategoryId: 'photography',
      imageUrl: '/images/skills/skill-001.jpg',
      authorId: 'user-001',
      createdAt: '2026-01-10T09:00:00Z',
      likeCount: 5,
    },
    {
      id: 'skill-002',
      title: 'Английский язык для начинающих',
      description:
        'Помогу разобраться с базовой грамматикой, произношением и разговорной практикой.',
      type: 'teach',
      subcategoryId: 'english',
      imageUrl: '/images/skills/skill-002.jpg',
      authorId: 'user-002',
      createdAt: '2026-01-11T10:30:00Z',
      likeCount: 0,
    },
    {
      id: 'skill-003',
      title: 'Изучение японского языка',
      description: 'Ищу человека, который поможет освоить японский язык и базовую грамматику.',
      type: 'learn',
      subcategoryId: 'japanese',
      imageUrl: '/images/skills/skill-003.jpg',
      authorId: 'user-003',
      createdAt: '2026-01-12T12:15:00Z',
      likeCount: 6,
    },
  ]

  describe('sortByPopularity', () => {
    test('сортирует по убыванию лайков', () => {
      const skillByAuthorId = new Map(mockSkills.map((skill) => [skill.authorId, skill]))
      const result = sortByPopularity(mockUsers, skillByAuthorId)
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-001', 'user-002'])
    })

    test('не мутирует исходный массив', () => {
      const skillByAuthorId = new Map(mockSkills.map((skill) => [skill.authorId, skill]))
      const original = [...mockUsers]
      sortByPopularity(mockUsers, skillByAuthorId)
      expect(mockUsers).toEqual(original)
    })
  })

  describe('sortByDate', () => {
    test('по умолчанию сначала новые', () => {
      const result = sortByDate(mockUsers)
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-002', 'user-001'])
    })

    test('с order = newest сортирует сначала новые', () => {
      const result = sortByDate(mockUsers, 'newest')
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-002', 'user-001'])
    })

    test('с order = oldest сортирует сначала старые', () => {
      const result = sortByDate(mockUsers, 'oldest')
      expect(result.map((user) => user.id)).toEqual(['user-001', 'user-002', 'user-003'])
    })

    test('не мутирует исходный массив', () => {
      const original = [...mockUsers]
      sortByDate(mockUsers)
      expect(mockUsers).toEqual(original)
    })
  })

  describe('sortByRecommendations', () => {
    test('возвращает массив той же длины и с теми же элементами', () => {
      const result = sortByRecommendations(mockUsers)
      expect(result).toHaveLength(mockUsers.length)
      expect(result).toEqual(expect.arrayContaining(mockUsers))
    })

    test('не мутирует исходный массив', () => {
      const original = [...mockUsers]
      sortByRecommendations(mockUsers)
      expect(mockUsers).toEqual(original)
    })
  })

  describe('sortUsers', () => {
    test('с sortType = popularity, сортирует по убыванию лайков ', () => {
      const result = sortUsers(mockUsers, mockSkills, 'popularity')
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-001', 'user-002'])
    })

    test('с sortType = date, по умолчанию сначала новые', () => {
      const result = sortUsers(mockUsers, mockSkills, 'date')
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-002', 'user-001'])
    })

    test('с sortType = date и dateOrder = newest, сортирует сначала новые', () => {
      const result = sortUsers(mockUsers, mockSkills, 'date', 'newest')
      expect(result.map((user) => user.id)).toEqual(['user-003', 'user-002', 'user-001'])
    })

    test('с sortType = date и dateOrder = oldest, сортирует сначала старые', () => {
      const result = sortUsers(mockUsers, mockSkills, 'date', 'oldest')
      expect(result.map((user) => user.id)).toEqual(['user-001', 'user-002', 'user-003'])
    })

    test('с sortType = recommendations, возвращает массив той же длины и с теми же элементами', () => {
      const result = sortUsers(mockUsers, mockSkills, 'recommendations')
      expect(result).toHaveLength(mockUsers.length)
      expect(result).toEqual(expect.arrayContaining(mockUsers))
    })

    test('не мутирует исходный массив', () => {
      const original = [...mockUsers]
      sortUsers(mockUsers, mockSkills, 'popularity')
      expect(mockUsers).toEqual(original)
    })
  })
})
