import Styles from './Notifications.module.css'
import { NotificationItem, Notification } from '@/shared/ui'
import clsx from 'clsx'

export interface NotificationsProps {
  notifications?: Notification[];
  readAll?: () => void;
  clearAll?: () => void;
  onClick?: () => void;
}

export const Notifications = ({notifications = [], readAll, clearAll, onClick} : NotificationsProps) => {
  const unread = notifications.filter((item) => item.status === "unread");
  const read = notifications.filter((item) => item.status === "read");
  if (notifications.length === 0) {
    return (
      <div className={Styles.Widget}>
        <h2 className={Styles.None}>Уведомлений нет</h2>
      </div>
    )
  } else {
    return (
      <div className={Styles.Widget}>
        {unread?.length !== 0 && (
          <div className={Styles.NotiBlock}>
            <div className={Styles.Title}>
              <h2>Новые Уведомления</h2>
              <button type="button" onClick={readAll}>
                <span className={Styles.ButtonSpan}>Прочитать все</span>
              </button>
            </div>
            <div className={clsx(Styles.Notify, Styles.Unread)}>
              {unread?.map((item) => (
                <NotificationItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  button={item.button}
                  onClick={onClick}
                  status={item.status}
                />
              ))}
            </div>
          </div>
        )}
        {read?.length !== 0 && (
          <div className={Styles.NotiBlock}>
            <div className={Styles.Title}>
              <h2>Просмотренные</h2>
              <button type="button" onClick={clearAll}>
                <span className={Styles.ButtonSpan}>Очистить</span>
              </button>
            </div>
            <div className={clsx(Styles.Notify, Styles.Read)}>
              {read?.map((item) => (
                <NotificationItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  date={item.date}
                  button={item.button}
                  status={item.status}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}
