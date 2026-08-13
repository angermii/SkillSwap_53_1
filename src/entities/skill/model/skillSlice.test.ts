import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import skillReducer, { fetchSkill, fetchSkillById, fetchSkillByUserId } from './skillSlice'
import type { Skill } from './types'
console.log('NEW TEST FILE');
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
      userSkills: []
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
      userSkills: []
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
      userSkills: []
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
      userSkills: [testSkill]
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
      userSkills: []
    })
  })
})
