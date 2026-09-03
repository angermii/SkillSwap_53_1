import { createSelector } from '@reduxjs/toolkit'

import { OTHER_CITY_OPTION } from '@/shared/lib/constants'

import type { UserState } from './userSlice'
import type { User } from './types'
import { RootState } from '@/store'

type StateWithUser = { user: UserState }

// Вариант выпадающего списка: совместим с ProfileOption и RegistrationOption
export type CityOption = {
  name: string
  value: string
}

// Данные

export const selectUsers = (state: StateWithUser): User[] => state.user.items

export const selectUserById = (state: RootState, userId?: string) => {
  if (!userId) return null

  return state.user.items.find((user) => user.id === userId) ?? null
}
// Options

export const selectCityOptions = createSelector([selectUsers], (users): CityOption[] => {
  const cities = Array.from(new Set(users.map((user) => user.city)))
    .filter((city): city is string => Boolean(city))
    .sort((a, b) => a.localeCompare(b, 'ru'))

  return [...cities.map((city) => ({ name: city, value: city })), { ...OTHER_CITY_OPTION }]
})
