import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Skill, SkillCategory, SkillSubcategory } from '@/shared/types'

import {
  fetchSkillById,
  fetchSkillByUserId,
  fetchSkillCategories,
  fetchSkillSubcategories,
  fetchSkills,
} from './skills'

const makeSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: 'skill-1',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach',
  subcategoryId: 'subcategory-1',
  imageUrl: null,
  authorId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
  ...overrides,
})

const mockFetchOk = (data: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: async () => data })

const mockFetchFail = () => vi.fn().mockResolvedValue({ ok: false, json: async () => null })

describe('api/skills', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetchOk([]))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchSkills', () => {
    it('запрашивает skills.json и возвращает список', async () => {
      const skills = [makeSkill()]
      const fetchMock = mockFetchOk(skills)
      vi.stubGlobal('fetch', fetchMock)

      await expect(fetchSkills()).resolves.toEqual(skills)
      expect(fetchMock).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}db/skills.json`)
    })

    it('бросает ошибку, если ответ неуспешный', async () => {
      vi.stubGlobal('fetch', mockFetchFail())

      await expect(fetchSkills()).rejects.toThrow('Failed to fetch skills')
    })
  })

  describe('fetchSkillById', () => {
    it('возвращает навык с нужным id', async () => {
      const target = makeSkill({ id: 'skill-2' })
      vi.stubGlobal('fetch', mockFetchOk([makeSkill(), target]))

      await expect(fetchSkillById('skill-2')).resolves.toEqual(target)
    })

    it('возвращает undefined, если навык не найден', async () => {
      vi.stubGlobal('fetch', mockFetchOk([makeSkill()]))

      await expect(fetchSkillById('unknown')).resolves.toBeUndefined()
    })
  })

  describe('fetchSkillByUserId', () => {
    it('возвращает только навыки указанного автора', async () => {
      const own = makeSkill({ id: 'skill-1', authorId: 'user-1' })
      vi.stubGlobal('fetch', mockFetchOk([own, makeSkill({ id: 'skill-2', authorId: 'user-2' })]))

      await expect(fetchSkillByUserId('user-1')).resolves.toEqual([own])
    })

    it('возвращает пустой массив, если у автора нет навыков', async () => {
      vi.stubGlobal('fetch', mockFetchOk([makeSkill({ authorId: 'user-2' })]))

      await expect(fetchSkillByUserId('user-1')).resolves.toEqual([])
    })
  })

  describe('fetchSkillCategories', () => {
    it('запрашивает справочник категорий', async () => {
      const categories: SkillCategory[] = [{ id: 'category-1', title: 'Образование' }]
      const fetchMock = mockFetchOk(categories)
      vi.stubGlobal('fetch', fetchMock)

      await expect(fetchSkillCategories()).resolves.toEqual(categories)
      expect(fetchMock).toHaveBeenCalledWith('/db/skillCategories.json')
    })

    it('бросает ошибку, если ответ неуспешный', async () => {
      vi.stubGlobal('fetch', mockFetchFail())

      await expect(fetchSkillCategories()).rejects.toThrow('Failed to fetch skill categories')
    })
  })

  describe('fetchSkillSubcategories', () => {
    it('запрашивает справочник подкатегорий', async () => {
      const subcategories: SkillSubcategory[] = [
        { id: 'subcategory-1', title: 'Программирование', categoryId: 'category-1' },
      ]
      const fetchMock = mockFetchOk(subcategories)
      vi.stubGlobal('fetch', fetchMock)

      await expect(fetchSkillSubcategories()).resolves.toEqual(subcategories)
      expect(fetchMock).toHaveBeenCalledWith('/db/skillSubcategories.json')
    })

    it('бросает ошибку, если ответ неуспешный', async () => {
      vi.stubGlobal('fetch', mockFetchFail())

      await expect(fetchSkillSubcategories()).rejects.toThrow('Failed to fetch skill subcategories')
    })
  })
})
