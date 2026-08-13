import type { User } from './types'
import { getRegisteredUsers } from '@/features/auth'
import { mapAuthUserToUser } from '@/shared/lib/authUserMapper'
import { fetchUsers as apiFetchUsers, fetchUserById as apiFetchUserById } from '@/api/users'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  items: User[]
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  items: [],
  user: null,
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk<User[]>('user/fetchUsers', async () => {
  const apiUsers = await apiFetchUsers()
  const usersById = new Map(apiUsers.map((user) => [user.id, user]))

  getRegisteredUsers().forEach(({ profile }) => {
    usersById.set(profile.id, mapAuthUserToUser(profile))
  })

  return Array.from(usersById.values())
})

export const fetchUserById = createAsyncThunk<User, string>('user/fetchUserById', async (id) => {
  const registeredProfile = getRegisteredUsers().find(({ profile }) => profile.id === id)?.profile

  if (registeredProfile) {
    return mapAuthUserToUser(registeredProfile)
  }

  const user = await apiFetchUserById(id)

  if (!user) {
    throw new Error('Пользователь не найден')
  }

  return user
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Не удалось загрузить пользователей'
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Не удалось загрузить пользователя'
      })
  },
})

export default userSlice.reducer
