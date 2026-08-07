import { describe, test, expect } from 'vitest'
import type { Skill } from '@/shared/types'
import { sortByPopularity, sortByDate, sortByRecommendations } from './sortUtils'

describe('sortUtils', () => {
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
      createdAt: '2026-02-20T10:00:00Z',
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
      createdAt: '2026-02-21T10:00:00Z',
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
      createdAt: '2026-02-22T10:00:00Z',
      likeCount: 6,
    },
  ]

  describe('sortByPopularity', () => {
    test('сортирует по убыванию лайков', () => {
      const result = sortByPopularity(mockSkills)
      expect(result.map((skill) => skill.id)).toEqual(['skill-003', 'skill-001', 'skill-002'])
    })
    test('не мутирует исходный массив', () => {
      const original = [...mockSkills]
      sortByPopularity(mockSkills)

      expect(mockSkills).toEqual(original)
    })
  })

  describe('sortByDate', () => {
    test('по умолчанию сначала новые', () => {
      const result = sortByDate(mockSkills)
      expect(result.map((skill) => skill.id)).toEqual(['skill-003', 'skill-002', 'skill-001'])
    })
    test('с order = newest сортирует сначала новые', () => {
      const result = sortByDate(mockSkills, 'newest')

      expect(result.map((skill) => skill.id)).toEqual(['skill-003', 'skill-002', 'skill-001'])
    })

    test('с order = oldest сортирует сначала старые', () => {
      const result = sortByDate(mockSkills, 'oldest')

      expect(result.map((skill) => skill.id)).toEqual(['skill-001', 'skill-002', 'skill-003'])
    })

    test('не мутирует исходный массив', () => {
      const original = [...mockSkills]
      sortByDate(mockSkills)

      expect(mockSkills).toEqual(original)
    })
  })

  describe('sortByRecommendations', () => {
    test('возвращает массив той же длины и с теми же элементами', () => {
      const result = sortByRecommendations(mockSkills)

      expect(result).toHaveLength(mockSkills.length)
      expect(result).toEqual(expect.arrayContaining(mockSkills))
    })

    test('не мутирует исходный массив', () => {
      const original = [...mockSkills]
      sortByRecommendations(mockSkills)

      expect(mockSkills).toEqual(original)
    })
  })
})
