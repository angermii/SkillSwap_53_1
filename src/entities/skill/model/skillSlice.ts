import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit'
import {
  fetchSkillById as fetchSkillByIdApi,
  fetchSkillByUserId as fetchSkillByUserIdApi,
  fetchSkillCategories as fetchSkillCategoriesApi,
  fetchSkillSubcategories as fetchSkillSubcategoriesApi,
  fetchSkills,
} from '@/api/skills'
import type { Skill, SkillCategory, SkillSubcategory } from './types'

export type SkillRequestKey = 'skills' | 'selectedSkill' | 'categories' | 'subcategories'

// храним списочные результаты и отдельно выбранный навык
export interface SkillState {
  skills: Skill[]
  userSkills: Skill[]
  selectedSkill: Skill | null
  categories: SkillCategory[]
  subcategories: SkillSubcategory[]
  loading: Record<SkillRequestKey, boolean>
  error: Record<SkillRequestKey, string | null>
}

// состояние slice до выполнения первого запроса
const initialState: SkillState = {
  skills: [],
  userSkills: [],
  selectedSkill: null,
  categories: [],
  subcategories: [],
  loading: {
    skills: false,
    userSkills: false,
    selectedSkill: false,
    categories: false,
    subcategories: false,
  },
  error: {
    skills: null,
    userSkills: false,
    selectedSkill: null,
    categories: null,
    subcategories: null,
  },
}

// хелперы, чтобы не дублировать одни и те же строки в каждом case
const startRequest = (state: SkillState, key: SkillRequestKey) => {
  state.loading[key] = true
  state.error[key] = null
}

const failRequest = (
  state: SkillState,
  key: SkillRequestKey,
  error: SerializedError,
  fallbackMessage: string,
) => {
  state.loading[key] = false
  state.error[key] = error.message ?? fallbackMessage
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

// загружает справочник категорий навыков
export const fetchSkillCategories = createAsyncThunk<SkillCategory[]>(
  'skill/fetchSkillCategories',
  async () => fetchSkillCategoriesApi(),
)

// загружает справочник подкатегорий навыков
export const fetchSkillSubcategories = createAsyncThunk<SkillSubcategory[]>(
  'skill/fetchSkillSubcategories',
  async () => fetchSkillSubcategoriesApi(),
)

// объединяем состояние и обработчики навыков в Redux slice
const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // обрабатываем загрузку полного списка навыков
    builder
      .addCase(fetchSkill.pending, (state) => {
        startRequest(state, 'skills')
      })
      .addCase(fetchSkill.fulfilled, (state, action) => {
        state.loading.skills = false
        state.skills = action.payload
      })
      .addCase(fetchSkill.rejected, (state, action) => {
        failRequest(state, 'skills', action.error, 'Не удалось загрузить навыки')
      })

    // обрабатываем загрузку отдельного навыка
    builder
      .addCase(fetchSkillById.pending, (state) => {
        startRequest(state, 'selectedSkill')
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.loading.selectedSkill = false
        state.selectedSkill = action.payload ?? null
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        failRequest(state, 'selectedSkill', action.error, 'Не удалось загрузить навык')
      })

    // обрабатываем загрузку навыков конкретного пользователя
    builder
      .addCase(fetchSkillByUserId.pending, (state) => {
        startRequest(state, 'userSkills')
      })
      .addCase(fetchSkillByUserId.fulfilled, (state, action) => {
        state.loading.userSkills = false
        state.userSkills = action.payload
      })
      .addCase(fetchSkillByUserId.rejected, (state, action) => {
        failRequest(state, 'userSkills', action.error, 'Не удалось загрузить навыки пользователя')
      })

    // обрабатываем загрузку категорий
    builder
      .addCase(fetchSkillCategories.pending, (state) => {
        startRequest(state, 'categories')
      })
      .addCase(fetchSkillCategories.fulfilled, (state, action) => {
        state.loading.categories = false
        state.categories = action.payload
      })
      .addCase(fetchSkillCategories.rejected, (state, action) => {
        failRequest(state, 'categories', action.error, 'Не удалось загрузить категории')
      })

    // обрабатываем загрузку подкатегорий
    builder
      .addCase(fetchSkillSubcategories.pending, (state) => {
        startRequest(state, 'subcategories')
      })
      .addCase(fetchSkillSubcategories.fulfilled, (state, action) => {
        state.loading.subcategories = false
        state.subcategories = action.payload
      })
      .addCase(fetchSkillSubcategories.rejected, (state, action) => {
        failRequest(state, 'subcategories', action.error, 'Не удалось загрузить подкатегории')
      })
  },
})

export default skillSlice.reducer
