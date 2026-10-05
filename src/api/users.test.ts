import { afterEach, describe, expect, it, vi } from 'vitest'

import type { User } from '@/shared/types'

import { fetchUserById, fetchUsers } from './users'

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-1',
  name: 'Иван',
  email: 'ivan@mail.ru',
  avatarUrl: null,
  gender: 'male',
  age: 30,
  city: 'Москва',
  description: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

const mockFetchOk = (data: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, json: async () => data })

describe('api/users', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchUsers', () => {
    it('запрашивает users.json и возвращает список', async () => {
      const users = [makeUser()]
      const fetchMock = mockFetchOk(users)
      vi.stubGlobal('fetch', fetchMock)

      await expect(fetchUsers()).resolves.toEqual(users)
      expect(fetchMock).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}db/users.json`)
    })

    it('бросает ошибку, если ответ неуспешный', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => null }))

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users')
    })
  })

  describe('fetchUserById', () => {
    it('возвращает пользователя с нужным id', async () => {
      const target = makeUser({ id: 'user-2', name: 'Анна' })
      vi.stubGlobal('fetch', mockFetchOk([makeUser(), target]))

      await expect(fetchUserById('user-2')).resolves.toEqual(target)
    })

    it('возвращает undefined, если пользователь не найден', async () => {
      vi.stubGlobal('fetch', mockFetchOk([makeUser()]))

      await expect(fetchUserById('unknown')).resolves.toBeUndefined()
    })
  })
})
