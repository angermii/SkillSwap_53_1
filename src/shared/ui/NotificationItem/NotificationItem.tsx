import Styles from './NotificationItem.module.css'
import { Notification } from './types.ts'
import { BulbIcon, Button } from '@/shared/ui'

export const NotificationItem = ({id, title, description, date, status, onClick} : Notification) => {
  return (
    <div className={Styles.Wrapper}>
      <div className={Styles.Notification}>
        <div className={Styles.Item}>
          <BulbIcon size={40}/>
          <div className={Styles.Text}>
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </div>
        <p className={Styles.Date}>{date}</p>
      </div>
      {status==='unread' && <Button onClick={() => onClick?.(id)} className={Styles.ButtonWrapper}>Перейти</Button>}
    </div>
  )
}
