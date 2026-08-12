import { RequestItem } from "@/shared/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { acceptRequest, rejectRequest, selectPendingRequests } from "@/entities/request/requestsSlice";

import styles from './Requests.module.css'

export const Requests = () => {
    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(
        (state) => state.auth.user,
    )

    const requests = useAppSelector(selectPendingRequests)

    const handleAccept = (requestId: string) => {
        dispatch(acceptRequest(requestId))
    }

    const handleReject = (requestId: string) => {
        dispatch(rejectRequest(requestId))
    }

    const incomingRequests = requests.filter(
        (request) => request.toUserId === currentUser?.id,
    )

    if (incomingRequests.length === 0) {
        return (
            <div className={styles.Widget}>
                <h2 className={styles.None}></h2>
            </div>
        )
    }

    return (
        <div className={styles.Widget}>
            <h2 className={styles.Title}>
                Заявки
            </h2>

            <div>
                {incomingRequests.map((request) => (
                    <RequestItem
                        key={request.id}
                        id={request.id}
                        title="Новая заявка на обмен"
                        description="Пользователь предлагает обмен"
                        date={new Date(request.createdAt).toLocaleDateString(
                            'ru-RU',
                        )}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                ))}
            </div>
        </div>
    )
}