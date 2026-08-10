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

  it('logout clears user, isAuthenticated and localStorage', async () => {
    const { login, logout } = await import('./authSlice')
    const store = await createTestStore()

    store.dispatch(login(mockLoginPayload))
    store.dispatch(logout())

    expect(store.getState().auth).toEqual({ user: null, isAuthenticated: false })
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
  })
})