import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/shared/types'
import { clearAuthUser, getAuthUser, saveAuthUser } from './authUtils'
export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
}

const persistedUser = getAuthUser()

const initialState: AuthState = {
  user: persistedUser,
  isAuthenticated: persistedUser !== null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Omit<AuthUser, 'token'>>) => {
      const authUser = saveAuthUser(action.payload)
      state.user = authUser
      state.isAuthenticated = true
    },
    logout: (state) => {
      clearAuthUser()
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer