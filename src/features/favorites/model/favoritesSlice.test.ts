import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, beforeEach } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import favoritesReducer, { loadFavorites, toggleFavorite } from './favoritesSlice'

const TEST_USER_ID = 'user-001'

const createTestStore = () =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  })

describe('favoritesSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has empty initial state', () => {
    const store = createTestStore()

    expect(store.getState().favorites).toEqual({
      ids: [],
    })
  })

  it('loadFavorites restores favorites of a specific user from localStorage', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify({ [TEST_USER_ID]: ['skill-001', 'skill-002'] }),
    )

    const store = createTestStore()

    store.dispatch(loadFavorites(TEST_USER_ID))

    expect(store.getState().favorites).toEqual({
      ids: ['skill-001', 'skill-002'],
    })
  })

  it('loadFavorites returns empty ids when user has no saved favorites', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify({ 'other-user': ['skill-001'] }),
    )

    const store = createTestStore()

    store.dispatch(loadFavorites(TEST_USER_ID))

    expect(store.getState().favorites).toEqual({
      ids: [],
    })
  })

  it('toggleFavorite adds skillId to favorites and saves it to localStorage', () => {
    const store = createTestStore()

    store.dispatch(toggleFavorite({ userId: TEST_USER_ID, skillId: 'skill-001' }))

    expect(store.getState().favorites.ids).toEqual(['skill-001'])

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)!)
    expect(stored[TEST_USER_ID]).toEqual(['skill-001'])
  })

  it('toggleFavorite removes skillId from favorites and saves it to localStorage', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify({ [TEST_USER_ID]: ['skill-001', 'skill-002'] }),
    )

    const store = createTestStore()

    store.dispatch(loadFavorites(TEST_USER_ID))
    store.dispatch(toggleFavorite({ userId: TEST_USER_ID, skillId: 'skill-001' }))

    expect(store.getState().favorites.ids).toEqual(['skill-002'])

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)!)
    expect(stored[TEST_USER_ID]).toEqual(['skill-002'])
  })

  it('clearCurrentFavorites resets state without touching localStorage', () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify({ [TEST_USER_ID]: ['skill-001'] }),
    )

    const store = createTestStore()

    store.dispatch(loadFavorites(TEST_USER_ID))
    expect(store.getState().favorites.ids).toEqual(['skill-001'])

    store.dispatch({ type: 'favorites/clearCurrentFavorites' })

    expect(store.getState().favorites).toEqual({ ids: [] })

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)!)
    expect(stored[TEST_USER_ID]).toEqual(['skill-001'])
  })
})
