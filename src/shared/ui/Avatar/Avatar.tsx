import type { ImgHTMLAttributes } from 'react'

import { UserIcon } from '../icons'
import styles from './Avatar.module.css'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  alt: string
  src?: string | null
  size?: number
}

export function Avatar({ alt, className, height, size, src, width, ...props }: AvatarProps) {
  const avatarClassName = [styles.avatar, className].filter(Boolean).join(' ')

  const avatarWidth = width ?? size
  const avatarHeight = height ?? size

  // если не передали аватар, то ставим заглушки в виде иконки
  if (!src) {
    return (
      <span
        className={`${avatarClassName} ${styles.placeholder}`}
        style={{ width: avatarWidth, height: avatarHeight }}
        role="img"
        aria-label={alt}
      >
        <UserIcon aria-hidden />
      </span>
    )
  }

  return (
    <img
      alt={alt}
      className={avatarClassName}
      height={avatarHeight}
      src={src}
      width={avatarWidth}
      {...props}
    />
  )
}
