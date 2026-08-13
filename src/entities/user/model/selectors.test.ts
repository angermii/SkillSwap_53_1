import { describe, expect, it } from 'vitest'

import { OTHER_CITY_OPTION } from '@/shared/lib/constants'

import { selectCityOptions, selectUsers } from './selectors'
import type { UserState } from './userSlice'
import type { User } from './types'

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
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

const makeState = (items: User[]) => ({
  user: {
    items,
    user: null,
    loading: false,
    error: null,
  } satisfies UserState,
})

describe('user selectors', () => {
  describe('selectUsers', () => {
    it('возвращает список пользователей', () => {
      const users = [makeUser()]

      expect(selectUsers(makeState(users))).toEqual(users)
    })
  })

  describe('selectCityOptions', () => {
    it('возвращает только вариант «Другое», если пользователей нет', () => {
      expect(selectCityOptions(makeState([]))).toEqual([OTHER_CITY_OPTION])
    })

    it('убирает дубликаты городов', () => {
      const state = makeState([
        makeUser({ id: '1', city: 'Москва' }),
        makeUser({ id: '2', city: 'Москва' }),
      ])

      expect(selectCityOptions(state)).toEqual([
        { name: 'Москва', value: 'Москва' },
        OTHER_CITY_OPTION,
      ])
    })

    it('сортирует города по алфавиту с учётом русской локали', () => {
      const state = makeState([
        makeUser({ id: '1', city: 'Ярославль' }),
        makeUser({ id: '2', city: 'Астрахань' }),
        makeUser({ id: '3', city: 'Москва' }),
      ])

      expect(selectCityOptions(state).map((option) => option.value)).toEqual([
        'Астрахань',
        'Москва',
        'Ярославль',
        OTHER_CITY_OPTION.value,
      ])
    })

    it('пропускает пользователей без города', () => {
      const state = makeState([makeUser({ id: '1', city: '' }), makeUser({ id: '2', city: 'Уфа' })])

      expect(selectCityOptions(state)).toEqual([{ name: 'Уфа', value: 'Уфа' }, OTHER_CITY_OPTION])
    })

    it('всегда ставит «Другое» в конец списка', () => {
      const state = makeState([makeUser({ city: 'Ярославль' })])
      const options = selectCityOptions(state)

      expect(options.at(-1)).toEqual(OTHER_CITY_OPTION)
    })

    it('мемоизирует результат, пока список пользователей не изменился', () => {
      const state = makeState([makeUser()])

      expect(selectCityOptions(state)).toBe(selectCityOptions(state))
    })
  })
})
