import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/shared/types'
import {
  clearAuthUser,
  getAuthUser,
  saveAuthUser,
  saveRegisteredUser,
  updateRegisteredUser,
} from './authUtils'

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

    register: (
      state,
      action: PayloadAction<{ profile: Omit<AuthUser, 'token'>; password: string }>,
    ) => {
      const { profile, password } = action.payload

      saveRegisteredUser({ profile, password })

      state.user = saveAuthUser(profile)
      state.isAuthenticated = true
    },

    updateUser: (state, action: PayloadAction<Partial<Omit<AuthUser, 'id' | 'token'>>>) => {
      if (!state.user) return

      const previousEmail = state.user.email
      const updatedUser = saveAuthUser({ ...state.user, ...action.payload })

      state.user = updatedUser
      updateRegisteredUser(previousEmail, action.payload)
    },

    logout: (state) => {
      clearAuthUser()
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, register, logout, updateUser } = authSlice.actions
export default authSlice.reducer
