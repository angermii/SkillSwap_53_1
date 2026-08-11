import type { SwapRequest } from '@/entities/request/model/types'
import { formatDate } from '@/shared/lib/helpers'
import type { Notification } from '@/shared/ui'

export const mapRequestsToNotifications = (
  requests: SwapRequest[],
): Notification[] =>
  requests.map((request) => ({
    id: request.id,
    title: 'Предложение обмена',

    // Пока запрос содержит только id навыка
    description: `Навык: ${request.skillId}`,

    date: formatDate(request.createdAt),
    status: request.isNotificationRead ? 'read' : 'unread',
  }))
