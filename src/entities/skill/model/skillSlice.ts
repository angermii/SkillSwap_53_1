import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchSkillById as fetchSkillByIdApi,
  fetchSkillByUserId as fetchSkillByUserIdApi,
  fetchSkills,
} from '@/api/skills'
import type { Skill } from './types'

// храним списочные результаты и отдельно выбранный навык
export interface SkillState {
  skills: Skill[]
  selectedSkill: Skill | null
  loading: boolean
  error: string | null
}

// состояние slice до выполнения первого запроса
const initialState: SkillState = {
  skills: [],
  selectedSkill: null,
  loading: false,
  error: null,
}

// загружает полный список навыков через существующий api
export const fetchSkill = createAsyncThunk<Skill[]>('skill/fetchSkill', async () => fetchSkills())

// загружает один навык по его идентификатору
export const fetchSkillById = createAsyncThunk<Skill | undefined, string>(
  'skill/fetchSkillById',
  async (id) => fetchSkillByIdApi(id),
)

// загружает навыки конкретного пользователя через api
export const fetchSkillByUserId = createAsyncThunk<Skill[], string>(
  'skill/fetchSkillByUserId',
  async (userId) => fetchSkillByUserIdApi(userId),
)

// объединяем состояние и обработчики навыков в Redux slice
const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {},

  // обрабатываем загрузку полного списка навыков
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkill.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSkill.fulfilled, (state, action) => {
        state.loading = false
        state.skills = action.payload
      })
      .addCase(fetchSkill.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? null
      })

    // обрабатываем загрузку отдельного навыка
    builder
      .addCase(fetchSkillById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedSkill = action.payload ?? null
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? null
      })

    // обрабатываем загрузку навыков конкретного пользователя
    builder
      .addCase(fetchSkillByUserId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSkillByUserId.fulfilled, (state, action) => {
        state.loading = false
        state.skills = action.payload
      })
      .addCase(fetchSkillByUserId.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? null
      })
  },
})

export default skillSlice.reducer
