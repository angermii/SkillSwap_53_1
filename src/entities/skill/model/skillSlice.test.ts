import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import skillReducer, {
  fetchSkill,
  fetchSkillById,
  fetchSkillByUserId,
  fetchSkillCategories,
  fetchSkillSubcategories,
} from './skillSlice'
import type { Skill, SkillCategory, SkillSubcategory } from './types'
// создаем изолированный store только со skill reducer
const createTestStore = () =>
  configureStore({
    reducer: {
      skill: skillReducer,
    },
  })

// тестовые данные соответствуют реальному типу Skill
const testSkill: Skill = {
  id: 'skill-001',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach',
  subcategoryId: 'subcategory-001',
  imageUrl: null,
  authorId: 'user-001',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
}

const emptyLoading = {
  skills: false,
  selectedSkill: false,
  categories: false,
  subcategories: false,
  userSkills: false,
}

const emptyError = {
  skills: null,
  selectedSkill: null,
  categories: null,
  subcategories: null,
  userSkills: null,
}

const testCategories: SkillCategory[] = [{ id: 'category-001', title: 'Образование' }]

const testSubcategories: SkillSubcategory[] = [
  { id: 'subcategory-001', title: 'Программирование', categoryId: 'category-001' },
]

describe('skillSlice', () => {
  it('has empty initial state', () => {
    const store = createTestStore()

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: null,
      categories: [],
      subcategories: [],
      loading: emptyLoading,
      error: emptyError,
      userSkills: [],
    })
  })

  it('stores skills when fetchSkill succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkill.pending('request-id', undefined))
    expect(store.getState().skill.loading.skills).toBe(true)

    store.dispatch(fetchSkill.fulfilled([testSkill], 'request-id', undefined))
    expect(store.getState().skill).toEqual({
      skills: [testSkill],
      selectedSkill: null,
      categories: [],
      subcategories: [],
      loading: emptyLoading,
      error: emptyError,
      userSkills: [],
    })
  })

  it('stores selected skill when fetchSkillById succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillById.pending('request-id', testSkill.id))
    expect(store.getState().skill.loading.selectedSkill).toBe(true)

    store.dispatch(fetchSkillById.fulfilled(testSkill, 'request-id', testSkill.id))

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: testSkill,
      categories: [],
      subcategories: [],
      loading: emptyLoading,
      error: emptyError,
      userSkills: [],
    })
  })

  it('stores user skills when fetchSkillByUserId succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillByUserId.pending('request-id', testSkill.authorId))
    expect(store.getState().skill.loading.userSkills).toBe(true)

    store.dispatch(fetchSkillByUserId.fulfilled([testSkill], 'request-id', testSkill.authorId))

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: null,
      categories: [],
      subcategories: [],
      loading: emptyLoading,
      error: emptyError,
      userSkills: [testSkill],
    })
  })

  it('stores error when fetchSkill fails', () => {
    const store = createTestStore()

    store.dispatch(fetchSkill.pending('request-id', undefined))
    store.dispatch(
      fetchSkill.rejected(new Error('Failed to fetch skills'), 'request-id', undefined),
    )

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: null,
      categories: [],
      subcategories: [],
      loading: emptyLoading,
      error: {
        ...emptyError,
        skills: 'Failed to fetch skills',
      },
      userSkills: [],
    })
  })
  it('stores error when fetchSkillById fails', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillById.pending('request-id', 'skill-001'))
    store.dispatch(fetchSkillById.rejected(new Error('Not found'), 'request-id', 'skill-001'))

    expect(store.getState().skill.loading.selectedSkill).toBe(false)
    expect(store.getState().skill.error.selectedSkill).toBe('Not found')
  })

  it('stores error when fetchSkillByUserId fails', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillByUserId.pending('request-id', 'user-001'))
    store.dispatch(fetchSkillByUserId.rejected(new Error('Not found'), 'request-id', 'user-001'))

    expect(store.getState().skill.loading.userSkills).toBe(false)
    expect(store.getState().skill.error.userSkills).toBe('Not found')
  })

  it('sets loading and stores categories when fetchSkillCategories succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillCategories.pending('request-id', undefined))
    expect(store.getState().skill.loading.categories).toBe(true)

    store.dispatch(fetchSkillCategories.fulfilled(testCategories, 'request-id', undefined))

    expect(store.getState().skill.loading.categories).toBe(false)
    expect(store.getState().skill.categories).toEqual(testCategories)
  })

  it('stores error when fetchSkillCategories fails', () => {
    const store = createTestStore()

    store.dispatch(
      fetchSkillCategories.rejected(new Error('Categories failed'), 'request-id', undefined),
    )

    expect(store.getState().skill.error.categories).toBe('Categories failed')
  })

  it('sets loading and stores subcategories when fetchSkillSubcategories succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillSubcategories.pending('request-id', undefined))
    expect(store.getState().skill.loading.subcategories).toBe(true)

    store.dispatch(fetchSkillSubcategories.fulfilled(testSubcategories, 'request-id', undefined))

    expect(store.getState().skill.loading.subcategories).toBe(false)
    expect(store.getState().skill.subcategories).toEqual(testSubcategories)
  })

  it('stores error when fetchSkillSubcategories fails', () => {
    const store = createTestStore()

    store.dispatch(
      fetchSkillSubcategories.rejected(new Error('Subcategories failed'), 'request-id', undefined),
    )

    expect(store.getState().skill.error.subcategories).toBe('Subcategories failed')
  })

  it('falls back to a default message when the error has no message', () => {
    const store = createTestStore()

    store.dispatch({ type: fetchSkill.rejected.type, error: {} })
    store.dispatch({ type: fetchSkillById.rejected.type, error: {} })
    store.dispatch({ type: fetchSkillByUserId.rejected.type, error: {} })
    store.dispatch({ type: fetchSkillCategories.rejected.type, error: {} })
    store.dispatch({ type: fetchSkillSubcategories.rejected.type, error: {} })

    expect(store.getState().skill.error).toEqual({
      skills: 'Не удалось загрузить навыки',
      selectedSkill: 'Не удалось загрузить навык',
      userSkills: 'Не удалось загрузить навыки пользователя',
      categories: 'Не удалось загрузить категории',
      subcategories: 'Не удалось загрузить подкатегории',
    })
  })

  it('resets selected skill when fetchSkillById returns nothing', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillById.fulfilled(undefined, 'request-id', 'unknown'))

    expect(store.getState().skill.selectedSkill).toBeNull()
  })
})
