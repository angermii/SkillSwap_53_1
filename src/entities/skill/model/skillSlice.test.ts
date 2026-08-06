import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import skillReducer, { fetchSkill, fetchSkillById, fetchSkillByUserId } from './skillSlice'
import type { Skill } from './types'

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
}

describe('skillSlice', () => {
  it('has empty initial state', () => {
    const store = createTestStore()

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: null,
      loading: false,
      error: null,
    })
  })

  it('stores skills when fetchSkill succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkill.pending('request-id', undefined))
    expect(store.getState().skill.loading).toBe(true)

    store.dispatch(fetchSkill.fulfilled([testSkill], 'request-id', undefined))
    expect(store.getState().skill).toEqual({
      skills: [testSkill],
      selectedSkill: null,
      loading: false,
      error: null,
    })
  })

  it('stores selected skill when fetchSkillById succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillById.pending('request-id', testSkill.id))
    expect(store.getState().skill.loading).toBe(true)

    store.dispatch(fetchSkillById.fulfilled(testSkill, 'request-id', testSkill.id))

    expect(store.getState().skill).toEqual({
      skills: [],
      selectedSkill: testSkill,
      loading: false,
      error: null,
    })
  })

  it('stores user skills when fetchSkillByUserId succeeds', () => {
    const store = createTestStore()

    store.dispatch(fetchSkillByUserId.pending('request-id', testSkill.authorId))
    expect(store.getState().skill.loading).toBe(true)

    store.dispatch(fetchSkillByUserId.fulfilled([testSkill], 'request-id', testSkill.authorId))

    expect(store.getState().skill).toEqual({
      skills: [testSkill],
      selectedSkill: null,
      loading: false,
      error: null,
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
      loading: false,
      error: 'Failed to fetch skills',
    })
  })
})
