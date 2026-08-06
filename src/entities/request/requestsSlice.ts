import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { SwapRequest } from './model/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

interface RequestsState {
  requests: SwapRequest[]
}

const getInitialRequests = (): SwapRequest[] => {
  const savedRequests = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)

  if (!savedRequests) {
    return []
  }

  try {
    const parsed = JSON.parse(savedRequests)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveRequests = (requests: SwapRequest[]) => {
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.REQUESTS,
    JSON.stringify(requests),
  )
}

const initialState: RequestsState = {
  requests: getInitialRequests(),
}

export const requestsSlice = createSlice({
  name: 'requests',

  initialState,

  reducers: {
    // Создать новый запрос
    createRequest: (
      state,
      action: PayloadAction<{
        skillId: string
        fromUserId: string
        toUserId: string
      }>,
    ) => {
      const now = new Date().toISOString()

      const newRequest: SwapRequest = {
        id: crypto.randomUUID(),

        skillId: action.payload.skillId,

        fromUserId: action.payload.fromUserId,

        toUserId: action.payload.toUserId,

        status: 'pending',

        createdAt: now,

        updatedAt: now,
      }

      state.requests.push(newRequest)

      saveRequests(state.requests)
    },


    // Принять запрос
    acceptRequest: (
      state,
      action: PayloadAction<string>,
    ) => {
      const request = state.requests.find(
        item => item.id === action.payload,
      )

      if (request) {
        request.status = 'accepted'
        request.updatedAt = new Date().toISOString()
      }

      saveRequests(state.requests)
    },


    // Отклонить запрос
    rejectRequest: (
      state,
      action: PayloadAction<string>,
    ) => {
      const request = state.requests.find(
        item => item.id === action.payload,
      )

      if (request) {
        request.status = 'rejected'
        request.updatedAt = new Date().toISOString()
      }

      saveRequests(state.requests)
    },


    // Отменить запрос
    cancelRequest: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.requests = state.requests.filter(
        item => item.id !== action.payload,
      )

      saveRequests(state.requests)
    },
  },
})


export const {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = requestsSlice.actions


// Получить все запросы
export const selectAllRequests = (
  state: { requests: RequestsState },
) => state.requests.requests


// Получить ожидающие запросы
export const selectPendingRequests = (
  state: { requests: RequestsState },
) =>
  state.requests.requests.filter(
    request => request.status === 'pending',
  )


// Получить принятые запросы
export const selectAcceptedRequests = (
  state: { requests: RequestsState },
) =>
  state.requests.requests.filter(
    request => request.status === 'accepted',
  )


// Получить отклонённые запросы
export const selectRejectedRequests = (
  state: { requests: RequestsState },
) =>
  state.requests.requests.filter(
    request => request.status === 'rejected',
  )


export default requestsSlice.reducer