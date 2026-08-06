import { User } from './types'
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

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => await apiFetchUsers())

export const fetchUserById = createAsyncThunk('user/fetchUserById', async (id: string) => {
  const user = await apiFetchUserById(id)
  if (!user) throw new Error('Пользователь не найден')
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
