import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const createTestStore = async () => {
  vi.resetModules()

  const { default: favoritesReducer } = await import('./favoritesSlice')

  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  })
}

describe('favoritesSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has empty initial state when localStorage is empty', async () => {
    const store = await createTestStore()

    expect(store.getState().favorites).toEqual({
      ids: [],
    })
  })

  it('restores favorites from localStorage on init', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify(['skill-001', 'skill-002']),
    )

    const store = await createTestStore()

    expect(store.getState().favorites).toEqual({
      ids: ['skill-001', 'skill-002'],
    })
  })

  it('toggleFavorite adds id to favorites and saves it to localStorage', async () => {
    const { toggleFavorite } = await import('./favoritesSlice')

    const store = await createTestStore()

    store.dispatch(toggleFavorite('skill-001'))

    expect(store.getState().favorites.ids).toEqual([
      'skill-001',
    ])

    expect(
      JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)!,
      ),
    ).toEqual([
      'skill-001',
    ])
  })

  it('toggleFavorite removes id from favorites and saves it to localStorage', async () => {
    const { toggleFavorite } = await import('./favoritesSlice')

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.FAVORITES,
      JSON.stringify(['skill-001', 'skill-002']),
    )

    const store = await createTestStore()

    store.dispatch(toggleFavorite('skill-001'))

    expect(store.getState().favorites.ids).toEqual([
      'skill-002',
    ])

    expect(
      JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)!,
      ),
    ).toEqual([
      'skill-002',
    ])
  })
})