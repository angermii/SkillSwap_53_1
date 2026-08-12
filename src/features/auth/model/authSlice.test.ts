import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const createTestStore = async () => {
  vi.resetModules()
  const { default: authReducer } = await import('./authSlice')
  return configureStore({ reducer: { auth: authReducer } })
}

const mockLoginPayload = {
  id: '1',
  name: 'Иван',
  email: 'a@a.ru',
  avatarUrl: null,
  gender: 'male' as const,
  birthDate: '',
  city: '',
  description: '',
}

const mockSkill = {
  id: 'skill-1',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach' as const,
  subcategoryId: 'programming',
  imageUrl: null,
  authorId: '1',
  createdAt: '2026-08-12T00:00:00.000Z',
  likeCount: 0,
}

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('has unauthenticated initial state when localStorage is empty', async () => {
    const store = await createTestStore()
    expect(store.getState().auth).toEqual({ user: null, isAuthenticated: false })
  })

  it('restores user from localStorage on init', async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ id: '1', name: 'Иван', email: 'a@a.ru', token: 'mock_token_1' }),
    )

    const store = await createTestStore()

    expect(store.getState().auth.isAuthenticated).toBe(true)
    expect(store.getState().auth.user?.name).toBe('Иван')
  })

  it('login sets user, isAuthenticated and persists to localStorage', async () => {
    const { login } = await import('./authSlice')
    const store = await createTestStore()

    store.dispatch(login(mockLoginPayload))

    const state = store.getState().auth
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual({ ...mockLoginPayload, token: 'mock_token_1' })

    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)!)
    expect(stored).toEqual(state.user)
  })

  it('register persists user with skill and restores it from localStorage', async () => {
    const { register } = await import('./authSlice')
    const store = await createTestStore()
    const profile = { ...mockLoginPayload, skill: mockSkill }

    store.dispatch(register({ profile, password: 'password' }))

    expect(store.getState().auth.user).toEqual({
      ...profile,
      token: 'mock_token_1',
    })

    const storedAuthUser = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)!,
    )
    expect(storedAuthUser.skill).toEqual(mockSkill)

    const registeredUsers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)!,
    )
    expect(registeredUsers).toEqual([{ profile, password: 'password' }])

    const restoredStore = await createTestStore()
    expect(restoredStore.getState().auth.user?.skill).toEqual(mockSkill)
  })

  it('logout clears user, isAuthenticated and localStorage', async () => {
    const { login, logout } = await import('./authSlice')
    const store = await createTestStore()

    store.dispatch(login(mockLoginPayload))
    store.dispatch(logout())

    expect(store.getState().auth).toEqual({ user: null, isAuthenticated: false })
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })
})
