import { configureStore } from '@reduxjs/toolkit'

// Импортируй свои slice'ы здесь по мере их создания:
// import skillsReducer from '@/entities/skill/model/skillsSlice'
// import authReducer from '@/features/auth/model/authSlice'
import requestsReducer from '@/entities/request/requestsSlice'
import userReducer from '@/entities/user/model/userSlice'
import { favoritesReducer } from '@/features/favorites'

export const store = configureStore({
  reducer: {
    user: userReducer,
    // skills: skillsReducer,
    // auth: authReducer,
    requests: requestsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch