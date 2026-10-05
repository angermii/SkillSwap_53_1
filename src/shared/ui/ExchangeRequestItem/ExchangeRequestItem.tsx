import styles from './ExchangeRequestItem.module.css'
import type { ExchangeRequestItemProps } from './types'

import { BulbIcon, Button } from '@/shared/ui'

export const ExchangeRequestItem = ({
  id,
  title,
  description,
  date,
  onCancel,
}: ExchangeRequestItemProps) => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.Exchage}>
        <div className={styles.Item}>
          <BulbIcon size={40} />

          <div className={styles.Text}>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </div>

        <p className={styles.Date}>{date}</p>
      </div>

      <Button onClick={() => onCancel?.(id)} className={styles.ButtonWrapper}>
        Отменить
      </Button>
    </div>
  )
}
