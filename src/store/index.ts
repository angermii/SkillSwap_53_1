import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/entities/user/model/userSlice'
// Импортируй свои slice'ы здесь по мере их создания:
// import skillsReducer from '@/entities/skill/model/skillsSlice'
// import authReducer from '@/features/auth/model/authSlice'
import { favoritesReducer } from '@/features/favorites'

export const store = configureStore({
  reducer: {
    user: userReducer,
    // skills: skillsReducer,
    // auth: authReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
