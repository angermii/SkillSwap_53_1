import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'


const createTestStore = async () => {
  vi.resetModules()

  const { default: requestsReducer } = await import('./requestsSlice')

  return configureStore({
    reducer: {
      requests: requestsReducer,
    },
  })
}


describe('requestsSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })


  it('has empty initial state when localStorage is empty', async () => {
    const store = await createTestStore()

    expect(store.getState().requests).toEqual({
      requests: [],
    })
  })


  it('restores requests from localStorage on init', async () => {
    const savedRequests = [
      {
        id: '1',
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
        status: 'pending',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ]


    localStorage.setItem(
      LOCAL_STORAGE_KEYS.REQUESTS,
      JSON.stringify(savedRequests),
    )


    const store = await createTestStore()


    expect(store.getState().requests.requests)
      .toEqual(savedRequests)
  })


  it('createRequest adds new request and saves to localStorage', async () => {
    const {
      createRequest,
    } = await import('./requestsSlice')


    const store = await createTestStore()


    store.dispatch(
      createRequest({
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
      }),
    )


    const requests = store.getState().requests.requests


    expect(requests).toHaveLength(1)


    expect(requests[0]).toMatchObject({
      skillId: 'skill-1',
      fromUserId: 'user-1',
      toUserId: 'user-2',
      status: 'pending',
    })


    const stored = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)!,
    )


    expect(stored).toEqual(requests)
  })


  it('acceptRequest changes request status to accepted', async () => {
    const {
      createRequest,
      acceptRequest,
    } = await import('./requestsSlice')


    const store = await createTestStore()


    store.dispatch(
      createRequest({
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
      }),
    )


    const requestId =
      store.getState().requests.requests[0].id


    store.dispatch(
      acceptRequest(requestId),
    )


    const request =
      store.getState().requests.requests[0]


    expect(request.status)
      .toBe('accepted')

    expect(request.updatedAt)
      .toBeTruthy()
  })


  it('rejectRequest changes request status to rejected', async () => {
    const {
      createRequest,
      rejectRequest,
    } = await import('./requestsSlice')


    const store = await createTestStore()


    store.dispatch(
      createRequest({
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
      }),
    )


    const requestId =
      store.getState().requests.requests[0].id


    store.dispatch(
      rejectRequest(requestId),
    )


    const request =
      store.getState().requests.requests[0]


    expect(request.status)
      .toBe('rejected')

    expect(request.updatedAt)
      .toBeTruthy()
  })


  it('cancelRequest removes request and updates localStorage', async () => {
    const {
      createRequest,
      cancelRequest,
    } = await import('./requestsSlice')


    const store = await createTestStore()


    store.dispatch(
      createRequest({
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
      }),
    )


    const requestId =
      store.getState().requests.requests[0].id


    store.dispatch(
      cancelRequest(requestId),
    )


    expect(
      store.getState().requests.requests,
    )
      .toHaveLength(0)


    const stored = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)!,
    )


    expect(stored)
      .toEqual([])
  })


  it('selectPendingRequests returns only pending requests', async () => {
    const {
      createRequest,
      acceptRequest,
      selectPendingRequests,
    } = await import('./requestsSlice')


    const store = await createTestStore()


    store.dispatch(
      createRequest({
        skillId: 'skill-1',
        fromUserId: 'user-1',
        toUserId: 'user-2',
      }),
    )


    const id =
      store.getState().requests.requests[0].id


    store.dispatch(
      acceptRequest(id),
    )


    const result =
      selectPendingRequests(
        store.getState(),
      )


    expect(result)
      .toHaveLength(0)
  })

})