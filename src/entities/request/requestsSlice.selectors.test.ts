import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import type { SwapRequest } from './model/types'

import {
  selectAcceptedRequests,
  selectAllRequests,
  selectNotificationRequests,
  selectOutgoingRequestBySkill,
  selectRejectedRequests,
} from './requestsSlice'

const makeRequest = (overrides: Partial<SwapRequest> = {}): SwapRequest => ({
  id: 'request-1',
  skillId: 'skill-1',
  fromUserId: 'user-1',
  toUserId: 'user-2',
  status: 'pending',
  isNotificationRead: false,
  isNotificationDismissed: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

// Селекторы принимают только срез requests, поэтому собираем state вручную
const makeState = (requests: SwapRequest[]) => ({ requests: { requests } })

describe('requestsSlice: инициализация из localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('возвращает пустой список, если в localStorage лежит невалидный JSON', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, '{broken')

    const { default: requestsReducer } = await import('./requestsSlice')
    const store = configureStore({ reducer: { requests: requestsReducer } })

    expect(store.getState().requests.requests).toEqual([])
  })

  it('возвращает пустой список, если сохранён не массив', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify({ id: 'request-1' }))

    const { default: requestsReducer } = await import('./requestsSlice')
    const store = configureStore({ reducer: { requests: requestsReducer } })

    expect(store.getState().requests.requests).toEqual([])
  })
})

describe('requestsSlice: селекторы', () => {
  describe('selectAllRequests', () => {
    it('возвращает все запросы', () => {
      const requests = [makeRequest(), makeRequest({ id: 'request-2' })]

      expect(selectAllRequests(makeState(requests))).toEqual(requests)
    })
  })

  describe('selectOutgoingRequestBySkill', () => {
    const outgoing = makeRequest({ id: 'request-1', skillId: 'skill-1', fromUserId: 'user-1' })

    it('находит заявку пользователя по конкретному навыку', () => {
      const state = makeState([outgoing])

      expect(selectOutgoingRequestBySkill(state, 'skill-1', 'user-1')).toEqual(outgoing)
    })

    it('возвращает null, если skillId не передан', () => {
      const state = makeState([outgoing])

      expect(selectOutgoingRequestBySkill(state, undefined, 'user-1')).toBeNull()
    })

    it('возвращает null, если fromUserId не передан', () => {
      const state = makeState([outgoing])

      expect(selectOutgoingRequestBySkill(state, 'skill-1', undefined)).toBeNull()
    })

    it('игнорирует отклонённые заявки', () => {
      const state = makeState([makeRequest({ status: 'rejected' })])

      expect(selectOutgoingRequestBySkill(state, 'skill-1', 'user-1')).toBeNull()
    })

    it('возвращает null, если заявка отправлена другим пользователем', () => {
      const state = makeState([makeRequest({ fromUserId: 'user-9' })])

      expect(selectOutgoingRequestBySkill(state, 'skill-1', 'user-1')).toBeNull()
    })

    it('возвращает null, если заявка по другому навыку', () => {
      const state = makeState([makeRequest({ skillId: 'skill-9' })])

      expect(selectOutgoingRequestBySkill(state, 'skill-1', 'user-1')).toBeNull()
    })
  })

  describe('selectNotificationRequests', () => {
    it('возвращает входящие заявки, которые ещё не скрыты', () => {
      const visible = makeRequest({ id: 'request-1', toUserId: 'user-2' })
      const state = makeState([
        visible,
        makeRequest({ id: 'request-2', toUserId: 'user-2', isNotificationDismissed: true }),
        makeRequest({ id: 'request-3', toUserId: 'user-3' }),
      ])

      expect(selectNotificationRequests(state, 'user-2')).toEqual([visible])
    })
  })

  describe('selectAcceptedRequests', () => {
    it('возвращает только принятые заявки', () => {
      const accepted = makeRequest({ id: 'request-2', status: 'accepted' })
      const state = makeState([makeRequest(), accepted, makeRequest({ status: 'rejected' })])

      expect(selectAcceptedRequests(state)).toEqual([accepted])
    })
  })

  describe('selectRejectedRequests', () => {
    it('возвращает только отклонённые заявки', () => {
      const rejected = makeRequest({ id: 'request-3', status: 'rejected' })
      const state = makeState([makeRequest(), rejected])

      expect(selectRejectedRequests(state)).toEqual([rejected])
    })
  })
})
