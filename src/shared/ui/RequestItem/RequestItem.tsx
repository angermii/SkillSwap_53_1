import Styles from './RequestItem.module.css'

import { RequestItemProps } from './types'

import { BulbIcon, Button } from '@/shared/ui'

export const RequestItem = ({
  id,
  title,
  description,
  date,
  onAccept,
  onReject,
}: RequestItemProps) => {
  return (
    <div className={Styles.Wrapper}>
      <div className={Styles.Notification}>
        <div className={Styles.Item}>
          <BulbIcon size={40} />

          <div className={Styles.Text}>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </div>

        <p className={Styles.Date}>{date}</p>
      </div>

      <div className={Styles.Buttons}>
        {onAccept && (
          <Button
            onClick={() => onAccept?.(id)}
            className={Styles.ButtonAccept}
          >
            Принять
          </Button>
        )}

        {onReject && (
          <Button
            onClick={() => onReject?.(id)}
            className={Styles.ButtonReject}
          >
            Отклонить
          </Button>
        )}
      </div>
    </div>
  )
}