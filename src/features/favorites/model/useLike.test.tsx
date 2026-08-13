import { configureStore } from '@reduxjs/toolkit'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it } from 'vitest'

import authReducer, { login } from '@/features/auth/model/authSlice'
import type { Skill } from '@/entities/skill/model/types'

import favoritesReducer, { loadFavorites } from './favoritesSlice'
import { useLike } from './useLike'

const makeSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: 'skill-1',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach',
  subcategoryId: 'subcategory-1',
  imageUrl: null,
  authorId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 5,
  ...overrides,
})

const authProfile = {
  id: 'user-1',
  name: 'Иван',
  email: 'ivan@mail.ru',
  avatarUrl: null,
  gender: 'male' as const,
  birthDate: '1990-01-01',
  city: 'Москва',
  description: '',
}

const createTestStore = () =>
  configureStore({ reducer: { auth: authReducer, favorites: favoritesReducer } })

// Хук читает состояние из стора, поэтому оборачиваем его в Provider
const renderUseLike = (skills: Skill[], store: ReturnType<typeof createTestStore>) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  return renderHook(() => useLike({ skills }), { wrapper })
}

describe('useLike', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('берёт исходные счётчики лайков из навыков', () => {
    const store = createTestStore()

    const { result } = renderUseLike([makeSkill()], store)

    expect(result.current.likeCounts).toEqual({ 'skill-1': 5 })
  })

  it('восстанавливает счётчик из sessionStorage', () => {
    sessionStorage.setItem('skill-like-count-skill-1', '42')
    const store = createTestStore()

    const { result } = renderUseLike([makeSkill()], store)

    expect(result.current.likeCounts).toEqual({ 'skill-1': 42 })
  })

  it('строит likedState из избранного пользователя', () => {
    const store = createTestStore()
    store.dispatch(login(authProfile))
    store.dispatch(loadFavorites('user-1'))

    act(() => {
      store.dispatch({
        type: 'favorites/toggleFavorite',
        payload: { userId: 'user-1', skillId: 'skill-1' },
      })
    })

    const { result } = renderUseLike([makeSkill()], store)

    expect(result.current.likedState).toEqual({ 'skill-1': true })
  })

  it('открывает модалку регистрации для неавторизованного пользователя', () => {
    const store = createTestStore()

    const { result } = renderUseLike([makeSkill()], store)

    expect(result.current.isRegistrationModalOpen).toBe(false)

    act(() => {
      result.current.handleLike('skill-1')
    })

    expect(result.current.isRegistrationModalOpen).toBe(true)
    expect(store.getState().favorites.ids).toEqual([])
  })

  it('closeRegistrationModal закрывает модалку', () => {
    const store = createTestStore()
    const { result } = renderUseLike([makeSkill()], store)

    act(() => {
      result.current.handleLike('skill-1')
    })
    act(() => {
      result.current.closeRegistrationModal()
    })

    expect(result.current.isRegistrationModalOpen).toBe(false)
  })

  it('увеличивает счётчик и добавляет навык в избранное', () => {
    const store = createTestStore()
    store.dispatch(login(authProfile))

    const { result } = renderUseLike([makeSkill()], store)

    act(() => {
      result.current.handleLike('skill-1')
    })

    expect(result.current.likeCounts['skill-1']).toBe(6)
    expect(store.getState().favorites.ids).toEqual(['skill-1'])
    expect(sessionStorage.getItem('skill-like-count-skill-1')).toBe('6')
  })

  it('уменьшает счётчик и убирает навык из избранного при повторном лайке', () => {
    const store = createTestStore()
    store.dispatch(login(authProfile))

    const { result } = renderUseLike([makeSkill()], store)

    act(() => {
      result.current.handleLike('skill-1')
    })
    act(() => {
      result.current.handleLike('skill-1')
    })

    expect(result.current.likeCounts['skill-1']).toBe(5)
    expect(store.getState().favorites.ids).toEqual([])
  })

  it('не опускает счётчик ниже нуля', () => {
    const store = createTestStore()
    store.dispatch(login(authProfile))
    store.dispatch(loadFavorites('user-1'))

    act(() => {
      store.dispatch({
        type: 'favorites/toggleFavorite',
        payload: { userId: 'user-1', skillId: 'skill-1' },
      })
    })

    const { result } = renderUseLike([makeSkill({ likeCount: 0 })], store)

    act(() => {
      result.current.handleLike('skill-1')
    })

    expect(result.current.likeCounts['skill-1']).toBe(0)
  })
})
