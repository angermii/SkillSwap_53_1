import { configureStore } from '@reduxjs/toolkit'

import requestsReducer from '@/entities/request/requestsSlice'
import userReducer from '@/entities/user/model/userSlice'
import skillReducer from '@/entities/skill/model/skillSlice'
import { authReducer } from '@/features/auth'
import { favoritesReducer } from '@/features/favorites'

export const store = configureStore({
  reducer: {
    user: userReducer,
    skill: skillReducer,
    auth: authReducer,
    requests: requestsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
