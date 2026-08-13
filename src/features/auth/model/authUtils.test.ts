import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

import {
  clearAuthUser,
  findRegisteredUser,
  getAuthUser,
  getRegisteredUsers,
  saveAuthUser,
  saveRegisteredUser,
  updateRegisteredUser,
  type RegisteredUser,
} from './authUtils'

const makeProfile = (overrides: Partial<RegisteredUser['profile']> = {}) => ({
  id: '1',
  name: 'Иван',
  email: 'ivan@mail.ru',
  avatarUrl: null,
  gender: 'male' as const,
  birthDate: '1990-01-01',
  city: 'Москва',
  description: '',
  ...overrides,
})

const makeUser = (overrides: Partial<RegisteredUser> = {}): RegisteredUser => ({
  password: 'Password1!',
  profile: makeProfile(),
  ...overrides,
})

const readUsers = (): RegisteredUser[] =>
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USERS) ?? '[]')

describe('authUtils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('getRegisteredUsers', () => {
    it('возвращает пустой массив, если реестр пуст', () => {
      expect(getRegisteredUsers()).toEqual([])
    })

    it('возвращает пустой массив, если в localStorage лежит невалидный JSON', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, 'not-a-json')

      expect(getRegisteredUsers()).toEqual([])
    })

    it('читает сохранённый список пользователей', () => {
      const user = makeUser()
      localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify([user]))

      expect(getRegisteredUsers()).toEqual([user])
    })
  })

  describe('saveRegisteredUser', () => {
    it('добавляет нового пользователя в реестр', () => {
      const user = makeUser()

      saveRegisteredUser(user)

      expect(readUsers()).toEqual([user])
    })

    it('перезаписывает пользователя с тем же email, не создавая дубль', () => {
      const user = makeUser()
      saveRegisteredUser(user)

      const updated = makeUser({ password: 'NewPassword1!' })
      saveRegisteredUser(updated)

      expect(readUsers()).toEqual([updated])
    })

    it('добавляет второго пользователя с другим email', () => {
      const first = makeUser()
      const second = makeUser({ profile: makeProfile({ id: '2', email: 'anna@mail.ru' }) })

      saveRegisteredUser(first)
      saveRegisteredUser(second)

      expect(readUsers()).toEqual([first, second])
    })
  })

  describe('updateRegisteredUser', () => {
    it('обновляет профиль, не трогая пароль', () => {
      saveRegisteredUser(makeUser())

      updateRegisteredUser('ivan@mail.ru', { city: 'Казань' })

      const [stored] = readUsers()
      expect(stored.profile.city).toBe('Казань')
      expect(stored.profile.name).toBe('Иван')
      expect(stored.password).toBe('Password1!')
    })

    it('ничего не делает, если пользователь не найден', () => {
      const user = makeUser()
      saveRegisteredUser(user)

      updateRegisteredUser('unknown@mail.ru', { city: 'Казань' })

      expect(readUsers()).toEqual([user])
    })
  })

  describe('findRegisteredUser', () => {
    beforeEach(() => {
      saveRegisteredUser(makeUser())
    })

    it('находит пользователя по email и паролю', () => {
      expect(findRegisteredUser('ivan@mail.ru', 'Password1!')?.profile.id).toBe('1')
    })

    it('игнорирует регистр и пробелы в email', () => {
      expect(findRegisteredUser('  IVAN@Mail.ru  ', 'Password1!')).not.toBeNull()
    })

    it('возвращает null при неверном пароле', () => {
      expect(findRegisteredUser('ivan@mail.ru', 'wrong')).toBeNull()
    })

    it('возвращает null, если такого email нет', () => {
      expect(findRegisteredUser('unknown@mail.ru', 'Password1!')).toBeNull()
    })
  })

  describe('getAuthUser', () => {
    it('возвращает null, если пользователь не сохранён', () => {
      expect(getAuthUser()).toBeNull()
    })

    it('возвращает null, если в localStorage лежит невалидный JSON', () => {
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, '{oops')

      expect(getAuthUser()).toBeNull()
    })

    it('читает сохранённого пользователя', () => {
      const authUser = { ...makeProfile(), token: 'mock_token_1' }
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))

      expect(getAuthUser()).toEqual(authUser)
    })
  })

  describe('saveAuthUser', () => {
    it('добавляет mock-токен и сохраняет пользователя в localStorage', () => {
      const profile = makeProfile()

      const result = saveAuthUser(profile)

      expect(result).toEqual({ ...profile, token: 'mock_token_1' })
      expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)!)).toEqual(result)
    })
  })

  describe('clearAuthUser', () => {
    it('удаляет текущего пользователя из localStorage', () => {
      saveAuthUser(makeProfile())

      clearAuthUser()

      expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
    })
  })
})
