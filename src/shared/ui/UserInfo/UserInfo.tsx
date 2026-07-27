import clsx from 'clsx'

import { Avatar } from '../Avatar'
import type { UserInfoProps } from './type'
import styles from './UserInfo.module.css'

function getAgeWord(value: number) {
  const lastDigit = value % 10
  const lastTwoDigits = value % 100

  if (lastTwoDigits > 10 && lastTwoDigits < 20) return 'лет'
  if (lastDigit > 1 && lastDigit < 5) return 'года'
  if (lastDigit === 1) return 'год'

  return 'лет'
}

export const UserInfo = ({
  avatarSrc,
  avatarAlt,
  name,
  city,
  age,
  className,
  ...props
}: UserInfoProps) => {
  return (
    <div {...props} className={clsx(styles.userInfo, className)}>
      <Avatar className={styles.avatar} src={avatarSrc} alt={avatarAlt ?? name} size={100} />
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
        <p className={styles.details}>
          {city}, {age} {getAgeWord(age)}
        </p>
      </div>
    </div>
  )
}
