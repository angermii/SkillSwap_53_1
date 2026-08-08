import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import userReducer, { fetchUserById, fetchUsers } from './userSlice'
import type { User } from './types'

import * as usersApi from '@/api/users'

vi.mock('@/api/users', () => ({
  fetchUsers: vi.fn(),
  fetchUserById: vi.fn(),
}))

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
    },
  })

const testUser: User = {
  id: 'user-001',
  name: 'Иван',
  email: 'ivan@test.ru',
  avatarUrl: null,
  gender: 'male',
  age: 25,
  city: 'Москва',
  description: 'Frontend developer',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('userSlice', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('has empty initial state', () => {
        const store = createTestStore()

        expect(store.getState().user).toEqual({
        items: [],
        user: null,
        loading: false,
        error: null,
        })   
    })
    it('stores users when fetchUsers succeeds', () => {
        const store = createTestStore()

        store.dispatch(fetchUsers.pending('request-id', undefined))
        expect(store.getState().user.loading).toBe(true)

        store.dispatch(fetchUsers.fulfilled([testUser], 'request-id', undefined))

        expect(store.getState().user).toEqual({
        items: [testUser],
        user: null,
        loading: false,
        error: null,
        })
    })

    it('stores selected user when fetchUserById succeeds', () => {
        const store = createTestStore()

        store.dispatch(fetchUserById.pending('request-id', testUser.id))
        expect(store.getState().user.loading).toBe(true)

        store.dispatch(
        fetchUserById.fulfilled(testUser, 'request-id', testUser.id),
        )

        expect(store.getState().user).toEqual({
        items: [],
        user: testUser,
        loading: false,
        error: null,
        })
    })

    it('stores error when fetchUsers fails', () => {
        const store = createTestStore()

        store.dispatch(fetchUsers.pending('request-id', undefined))
        store.dispatch(
        fetchUsers.rejected(
            new Error('Failed to fetch users'),
            'request-id',
            undefined,
        ),
        )

        expect(store.getState().user).toEqual({
        items: [],
        user: null,
        loading: false,
        error: 'Failed to fetch users',
        })
    })

    it('stores error when fetchUserById fails', () => {
        const store = createTestStore()

        store.dispatch(fetchUserById.pending('request-id', testUser.id))
        store.dispatch(
        fetchUserById.rejected(
            new Error('Пользователь не найден'),
            'request-id',
            testUser.id,
        ),
        )

        expect(store.getState().user).toEqual({
        items: [],
        user: null,
        loading: false,
        error: 'Пользователь не найден',
        })
    })

    it('fetchUsers thunk calls api and stores users', async () => {
        vi.mocked(usersApi.fetchUsers).mockResolvedValue([testUser])

        const store = createTestStore()

        await store.dispatch(fetchUsers())

        expect(usersApi.fetchUsers).toHaveBeenCalledTimes(1)
        expect(store.getState().user.items).toEqual([testUser])
    })

    it('fetchUserById thunk calls api and stores selected user', async () => {
        vi.mocked(usersApi.fetchUserById).mockResolvedValue(testUser)

        const store = createTestStore()

        await store.dispatch(fetchUserById(testUser.id))

        expect(usersApi.fetchUserById).toHaveBeenCalledWith(testUser.id)
        expect(store.getState().user.user).toEqual(testUser)
    })

    it('fetchUsers thunk handles api error', async () => {
        vi.mocked(usersApi.fetchUsers).mockRejectedValue(
        new Error('Failed to fetch users'),
        )

        const store = createTestStore()

        await store.dispatch(fetchUsers())

        expect(store.getState().user.error).toBe('Failed to fetch users')
    })

    it('fetchUserById thunk handles api error', async () => {
        vi.mocked(usersApi.fetchUserById).mockRejectedValue(
        new Error('Пользователь не найден'),
        )

        const store = createTestStore()

        await store.dispatch(fetchUserById(testUser.id))

        expect(store.getState().user.error).toBe('Пользователь не найден')
    })
})