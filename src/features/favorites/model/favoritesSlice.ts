import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getFavorites, saveFavorites } from './favoritesUtils'

export interface FavoritesState {
  ids: string[]
}

const initialState: FavoritesState = {
  ids: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Загружаем избранное конкретного пользователя
    loadFavorites: (state, action: PayloadAction<string>) => {
      state.ids = getFavorites(action.payload)
    },

    // Добавляем или убираем навык из избранного
    // сохраняем обновлённый список пользователя
    toggleFavorite: (
      state,
      action: PayloadAction<{
        userId: string
        skillId: string
      }>,
    ) => {
      const { userId, skillId } = action.payload

      if (state.ids.includes(skillId)) {
        state.ids = state.ids.filter((item) => item !== skillId)
      } else {
        state.ids.push(skillId)
      }

      saveFavorites(userId, state.ids)
    },

    // Очищаем только текущее Redux-состояние
    // Данные пользователя в localStorage при этом сохраняются
    clearCurrentFavorites: (state) => {
      state.ids = []
    },
  },
})

export const { loadFavorites, toggleFavorite, clearCurrentFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer
