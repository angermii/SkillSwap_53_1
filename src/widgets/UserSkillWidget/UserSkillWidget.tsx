import { GalleryCarousel } from '@/widgets/GalleryCarousel'
import type { GalleryCarouselProps } from '@/widgets'
import { SkillInfo, IconButton, ShareIcon, MoreIcon } from '@/shared/ui'
import { LikeButton } from '@/shared/ui/likeButton/likeButton'
import type { ReactNode } from 'react'
import styles from './UserSkillWidget.module.css'
import clsx from 'clsx'

export type UserSkillWidgetProps = {
  header?: { title: string; subtitle: string }
  like?: {
    count: number
    isLiked: boolean
    onClick?: (newCount: number, newIsLiked: boolean) => void
  }
  skill: { title: string; subtitle: string; description: string }
  gallery: {
    images: GalleryCarouselProps['images']
    maxThumbnails?: number
  }
  actions?: ReactNode
  className?: string
}

export const UserSkillWidget = ({
  header,
  like,
  skill,
  gallery,
  actions,
  className,
}: UserSkillWidgetProps) => {
  const isModalView = header !== undefined

  return (
    <div className={clsx(styles.container, className)}>
      {header && (
        <div className={styles.header}>
          <h2>{header.title}</h2>
          <p>{header.subtitle}</p>
        </div>
      )}
      {like && (
        <div className={styles.topActions}>
          <LikeButton count={like.count} isLiked={like.isLiked} onClick={like.onClick} />
          <IconButton
            icon={<ShareIcon aria-hidden="true" />}
            isActive={false}
            aria-label="Поделиться"
            onClick={() => {
              // заглушка
            }}
          />
          <IconButton
            icon={<MoreIcon aria-hidden="true" />}
            isActive={false}
            aria-label="Ещё"
            onClick={() => {
              // заглушка
            }}
          />
        </div>
      )}
      <div className={clsx(styles.content, isModalView && styles.contentModal)}>
        <SkillInfo title={skill.title} subtitle={skill.subtitle} description={skill.description}>
          {actions}
        </SkillInfo>
        <GalleryCarousel images={gallery.images} maxThumbnails={gallery.maxThumbnails} />
      </div>
    </div>
  )
}
