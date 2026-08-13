import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
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
  localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
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

        // новое предложение появляется как непрочитанное уведомление
        isNotificationRead: false,
        isNotificationDismissed: false,

        createdAt: now,

        updatedAt: now,
      }

      state.requests.push(newRequest)

      saveRequests(state.requests)
    },

    // Отметить все полученные уведомления как прочитанные
    readAllNotifications: (state, action: PayloadAction<string>) => {
      state.requests.forEach((request) => {
        if (request.toUserId === action.payload && !request.isNotificationDismissed) {
          request.isNotificationRead = true
        }
      })

      saveRequests(state.requests)
    },

    // отметить выбранное уведомление как прочитанное
    readNotification: (state, action: PayloadAction<string>) => {
      const request = state.requests.find(
        (item) => item.id === action.payload && !item.isNotificationDismissed,
      )

      if (request) {
        request.isNotificationRead = true
        saveRequests(state.requests)
      }
    },

    // Скрыть прочитанные уведомления текущего пользователя
    clearReadNotifications: (state, action: PayloadAction<string>) => {
      state.requests.forEach((request) => {
        if (request.toUserId === action.payload && request.isNotificationRead) {
          request.isNotificationDismissed = true
        }
      })

      saveRequests(state.requests)
    },

    // Принять запрос
    acceptRequest: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((item) => item.id === action.payload)

      if (request) {
        request.status = 'accepted'
        request.updatedAt = new Date().toISOString()
      }

      saveRequests(state.requests)
    },

    // Отклонить запрос
    rejectRequest: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((item) => item.id === action.payload)

      if (request) {
        request.status = 'rejected'
        request.updatedAt = new Date().toISOString()
      }

      saveRequests(state.requests)
    },

    // Отменить запрос
    cancelRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((item) => item.id !== action.payload)

      saveRequests(state.requests)
    },
  },
})

export const {
  createRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  readAllNotifications,
  readNotification,
  clearReadNotifications,
} = requestsSlice.actions

// Получить все запросы
export const selectAllRequests = (state: { requests: RequestsState }) => state.requests.requests

// Получить заявку, отправленную пользователем по конкретному навыку
export const selectOutgoingRequestBySkill = (
  state: { requests: RequestsState },
  skillId: string | undefined,
  fromUserId: string | undefined,
) => {
  if (!skillId || !fromUserId) {
    return null
  }

  return (
    state.requests.requests.find(
      (request) =>
        request.skillId === skillId &&
        request.fromUserId === fromUserId &&
        request.status !== 'rejected',
    ) ?? null
  )
}

// Получить входящие запросы, которые еще отображаются в уведомлениях
export const selectNotificationRequests = createSelector(
  [selectAllRequests, (_, userId: string) => userId],
  (requests, userId) =>
    requests.filter((req) => req.toUserId === userId && !req.isNotificationDismissed),
)

// Получить ожидающие запросы
export const selectPendingRequests = createSelector([selectAllRequests], (requests) =>
  requests.filter((req) => req.status === 'pending'),
)

// export const selectOutgoingRequests = (state: { requests: RequestsState }, userId: string) =>
//   state.requests.requests.filter((request) => request.fromUserId === userId)
export const selectOutgoingRequests = createSelector(
  [selectAllRequests, (_, userID: string) => userID],
  (requests, userID) => requests.filter((req) => req.fromUserId === userID),
)

// Получить принятые запросы
export const selectAcceptedRequests = createSelector([selectAllRequests], (requests) =>
  requests.filter((req) => req.status === 'accepted'),
)
// Получить отклонённые запросы
export const selectRejectedRequests = createSelector([selectAllRequests], (requests) =>
  requests.filter((req) => req.status === 'rejected'),
)

export default requestsSlice.reducer
