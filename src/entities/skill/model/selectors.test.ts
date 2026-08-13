import { describe, expect, it } from 'vitest'

import type { SkillState } from './skillSlice'
import type { Skill, SkillCategory, SkillSubcategory } from './types'

import {
  selectSelectedSkill,
  selectSelectedSkillError,
  selectSelectedSkillLoading,
  selectSkillCategories,
  selectSkillCategoriesById,
  selectSkillCategoriesError,
  selectSkillCategoriesLoading,
  selectSkillCategoryById,
  selectSkillSubcategories,
  selectSkillSubcategoriesById,
  selectSkillSubcategoriesError,
  selectSkillSubcategoriesLoading,
  selectSkillSubcategoryById,
  selectSkills,
  selectSkillsError,
  selectSkillsLoading,
} from './selectors'

const skill: Skill = {
  id: 'skill-1',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach',
  subcategoryId: 'subcategory-1',
  imageUrl: null,
  authorId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
}

const category: SkillCategory = { id: 'category-1', title: 'Образование' }

const subcategory: SkillSubcategory = {
  id: 'subcategory-1',
  title: 'Программирование',
  categoryId: 'category-1',
}

const makeState = (overrides: Partial<SkillState> = {}) => ({
  skill: {
    skills: [skill],
    userSkills: [],
    selectedSkill: skill,
    categories: [category],
    subcategories: [subcategory],
    loading: {
      skills: false,
      userSkills: false,
      selectedSkill: false,
      categories: false,
      subcategories: false,
    },
    error: {
      skills: null,
      userSkills: null,
      selectedSkill: null,
      categories: null,
      subcategories: null,
    },
    ...overrides,
  } satisfies SkillState,
})

describe('skill selectors', () => {
  describe('данные', () => {
    it('selectSkills возвращает список навыков', () => {
      expect(selectSkills(makeState())).toEqual([skill])
    })

    it('selectSelectedSkill возвращает выбранный навык', () => {
      expect(selectSelectedSkill(makeState())).toEqual(skill)
    })

    it('selectSkillCategories возвращает категории', () => {
      expect(selectSkillCategories(makeState())).toEqual([category])
    })

    it('selectSkillSubcategories возвращает подкатегории', () => {
      expect(selectSkillSubcategories(makeState())).toEqual([subcategory])
    })
  })

  describe('поиск по id', () => {
    it('selectSkillCategoriesById собирает Map категорий', () => {
      const map = selectSkillCategoriesById(makeState())

      expect(map.get('category-1')).toEqual(category)
      expect(map.size).toBe(1)
    })

    it('selectSkillSubcategoriesById собирает Map подкатегорий', () => {
      const map = selectSkillSubcategoriesById(makeState())

      expect(map.get('subcategory-1')).toEqual(subcategory)
    })

    it('selectSkillCategoryById находит категорию', () => {
      expect(selectSkillCategoryById(makeState(), 'category-1')).toEqual(category)
    })

    it('selectSkillCategoryById возвращает null для неизвестного id', () => {
      expect(selectSkillCategoryById(makeState(), 'unknown')).toBeNull()
    })

    it('selectSkillSubcategoryById находит подкатегорию', () => {
      expect(selectSkillSubcategoryById(makeState(), 'subcategory-1')).toEqual(subcategory)
    })

    it('selectSkillSubcategoryById возвращает null для неизвестного id', () => {
      expect(selectSkillSubcategoryById(makeState(), 'unknown')).toBeNull()
    })

    it('мемоизирует Map, пока категории не изменились', () => {
      const state = makeState()

      expect(selectSkillCategoriesById(state)).toBe(selectSkillCategoriesById(state))
    })
  })

  describe('loading', () => {
    it('возвращает флаги загрузки по ключам', () => {
      const state = makeState({
        loading: {
          skills: true,
          userSkills: false,
          selectedSkill: true,
          categories: true,
          subcategories: true,
        },
      })

      expect(selectSkillsLoading(state)).toBe(true)
      expect(selectSelectedSkillLoading(state)).toBe(true)
      expect(selectSkillCategoriesLoading(state)).toBe(true)
      expect(selectSkillSubcategoriesLoading(state)).toBe(true)
    })
  })

  describe('error', () => {
    it('возвращает ошибки по ключам', () => {
      const state = makeState({
        error: {
          skills: 'skills error',
          userSkills: null,
          selectedSkill: 'selected error',
          categories: 'categories error',
          subcategories: 'subcategories error',
        },
      })

      expect(selectSkillsError(state)).toBe('skills error')
      expect(selectSelectedSkillError(state)).toBe('selected error')
      expect(selectSkillCategoriesError(state)).toBe('categories error')
      expect(selectSkillSubcategoriesError(state)).toBe('subcategories error')
    })
  })
})
