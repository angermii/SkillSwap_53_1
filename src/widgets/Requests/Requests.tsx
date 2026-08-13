import { RequestItem } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import {
  acceptRequest,
  rejectRequest,
  selectOutgoingRequests,
  selectPendingRequests,
} from '@/entities/request/requestsSlice'

import styles from './Requests.module.css'

export const Requests = () => {
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector((state) => state.auth.user)

  const pendingRequests = useAppSelector(selectPendingRequests)

  const outgoingRequests = useAppSelector((state) => currentUser ? selectOutgoingRequests(state, currentUser.id) : [])

  const incomingRequests = pendingRequests.filter((request) => request.toUserId === currentUser?.id)

  const handleAccept = (requestId: string) => {
    dispatch(acceptRequest(requestId))
  }

  const handleReject = (requestId: string) => {
    dispatch(rejectRequest(requestId))
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className={styles.Widget}>
      <h2 className={styles.Title}>Заявки</h2>

      <section className={styles.Block}>
        <h3 className={styles.Subtitle}>Отправляемые</h3>

        {outgoingRequests.length === 0 ? (
          <p className={styles.None}>Отправляемых заявок нет</p>
        ) : (
          <div className={styles.List}>
            {outgoingRequests.map((request) => (
              <RequestItem
                key={request.id}
                id={request.id}
                title="Заявка на обмен"
                description="Вы отправили предложение обмена"
                date={new Date(request.createdAt).toLocaleDateString('ru-RU')}
              />
            ))}
          </div>
        )}
      </section>
      <section className={styles.Block}>
        <h3 className={styles.Subtitle}>Получаемые</h3>

        {incomingRequests.length === 0 ? (
          <p className={styles.None}>Полученных заявок нет</p>
        ) : (
          <div className={styles.List}>
            {incomingRequests.map((request) => (
              <RequestItem
                key={request.id}
                id={request.id}
                title="Новая заявка на обмен"
                description="Пользователь предлагает обмен"
                date={new Date(request.createdAt).toLocaleDateString('ru-RU')}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
