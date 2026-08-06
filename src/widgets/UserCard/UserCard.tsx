import clsx from 'clsx'

import { Button, CardTags, LikeButton, UserInfo } from '@/shared/ui'
import type { UserCardProps } from './type'
import styles from './UserCard.module.css'

export const UserCard = ({
  user,
  variant = 'compact',
  isLiked = false,
  likeCount = 0,
  onDetailsClick,
  onLikeChange,
  className,
  ...props
}: UserCardProps) => {
  const isCompact = variant === 'compact'

  return (
    <article {...props} className={clsx(styles.card, styles[variant], className)}>
      <div className={styles.userinfo}>
        <div className={styles.header}>
          <UserInfo name={user.name} city={user.city} age={user.age} avatarSrc={user.avatarUrl} />

          {isCompact && (
            <LikeButton
              count={likeCount}
              isLiked={isLiked}
              onClick={onLikeChange}
            />
          )}
        </div>

        {!isCompact && user.description && <p className={styles.description}>{user.description}</p>}
      </div>

      <div className={styles.content}>
        <CardTags
          className={styles.tags}
          teachTags={user.teachTags}
          learnTags={user.learnTags}
          teachHeading={isCompact ? 'Может научить:' : 'Может научить'}
          learnHeading={isCompact ? 'Хочет научиться:' : 'Хочет научиться'}
          gap={isCompact ? 12 : 24}
          sectionGap={isCompact ? 8 : 14}
        />

        {isCompact && (
          <Button className={styles.detailsButton} onClick={onDetailsClick}>
            Подробнее
          </Button>
        )}
      </div>
    </article>
  )
}
