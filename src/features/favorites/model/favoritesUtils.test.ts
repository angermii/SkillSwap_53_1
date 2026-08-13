import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import { clearFavorites, getFavorites, saveFavorites } from './favoritesUtils'

const readStorage = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES) ?? '{}')

describe('favoritesUtils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getFavorites', () => {
    it('возвращает пустой массив, если в localStorage ничего нет', () => {
      expect(getFavorites('user-1')).toEqual([])
    })

    it('возвращает пустой массив, если у пользователя нет избранного', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify({ 'user-2': ['skill-1'] }))

      expect(getFavorites('user-1')).toEqual([])
    })

    it('возвращает избранное только запрошенного пользователя', () => {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITES,
        JSON.stringify({ 'user-1': ['skill-1'], 'user-2': ['skill-2'] }),
      )

      expect(getFavorites('user-1')).toEqual(['skill-1'])
    })

    it('возвращает пустой массив, если в localStorage лежит невалидный JSON', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, 'broken')

      expect(getFavorites('user-1')).toEqual([])
    })
  })

  describe('saveFavorites', () => {
    it('создаёт запись, если хранилище пустое', () => {
      saveFavorites('user-1', ['skill-1'])

      expect(readStorage()).toEqual({ 'user-1': ['skill-1'] })
    })

    it('не затирает избранное других пользователей', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify({ 'user-2': ['skill-2'] }))

      saveFavorites('user-1', ['skill-1'])

      expect(readStorage()).toEqual({ 'user-1': ['skill-1'], 'user-2': ['skill-2'] })
    })

    it('перезаписывает список того же пользователя', () => {
      saveFavorites('user-1', ['skill-1'])
      saveFavorites('user-1', ['skill-3'])

      expect(readStorage()).toEqual({ 'user-1': ['skill-3'] })
    })

    it('не бросает исключение, если localStorage недоступен', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      expect(() => saveFavorites('user-1', ['skill-1'])).not.toThrow()
    })
  })

  describe('clearFavorites', () => {
    it('полностью удаляет запись из localStorage', () => {
      saveFavorites('user-1', ['skill-1'])

      clearFavorites()

      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)).toBeNull()
    })
  })
})
