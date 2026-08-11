import { describe, expect, it } from 'vitest'
import type { SwapRequest } from '@/entities/request/model/types'
import { mapRequestsToNotifications } from './mapRequestsToNotifications'

describe('mapRequestsToNotifications', () => {
  it('maps request data and notification status', () => {
    const request: SwapRequest = {
      id: 'request-1',
      skillId: 'skill-1',
      fromUserId: 'user-1',
      toUserId: 'user-2',
      status: 'pending',
      isNotificationRead: false,
      isNotificationDismissed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    const [notification] =
      mapRequestsToNotifications([request])

    expect(notification).toMatchObject({
      id: 'request-1',
      title: 'Предложение обмена',
      description: 'Навык: skill-1',
      status: 'unread',
    })

    expect(notification.date).toBeTruthy()
  })
})
