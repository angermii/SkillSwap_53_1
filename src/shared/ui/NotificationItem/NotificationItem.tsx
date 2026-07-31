import Styles from './NotificationItem.module.css'
import { NotificationItemProps } from './types.ts'
import { BulbIcon } from '@/shared/ui'

export const NotificationItem = ({title, description, date, button, status} : NotificationItemProps) => {
  return (
    <div className={Styles.Wrapper}>
      <div className={Styles.Notification}>
        <div className={Styles.Item}>
          <div className={Styles.IconWrapper}>
            <BulbIcon width={33.33} height={33.33} />
          </div>
          <div className={Styles.Text}>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </div>
        <p className={Styles.Date}>{date}</p>
      </div>
      {button && status==='unread' && <div className={Styles.ButtonWrapper}>{button}</div>}
    </div>
  )
}
