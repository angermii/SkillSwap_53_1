import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cancelRequest, selectAllRequests } from "@/entities/request/requestsSlice";
import { ExchangeRequestItem } from "@/shared/ui";
import { formatDate } from "@/shared/lib/helpers";

import styles from './ExchangesWidget.module.css'

export const ExchangesWidget = () => {
    const dispatch = useAppDispatch()

    const userId = useAppSelector((state) => state.auth.user?.id)

    const requests = useAppSelector(selectAllRequests)
    const receivedRequests = requests.filter(
        (request) => 
            request.toUserId === userId &&
            request.status === 'pending',
    )

    const handleCancel = (id: string) => {
        dispatch(cancelRequest(id))
    }

    if (receivedRequests.length === 0) {
        return (
            <div className={styles.Widget}>
                <h2 className={styles.None}>Получаемых обменов нет</h2>
            </div>
        )
    }

    return (
        <div className={styles.Widget}>
            <h2 className={styles.Title}>Мои обмены</h2>

            <div className={styles.Exchanges}>
                {receivedRequests.map((request) => (
                    <ExchangeRequestItem
                        key={request.id}
                        id={request.id}
                        title="Предложение обмена"
                        description={`Навык: ${request.skillId}`}
                        date={formatDate(request.createdAt)}
                        onCancel={handleCancel}
                    />
                ))}
            </div>
        </div>
    )
}