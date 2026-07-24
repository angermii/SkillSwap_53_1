import type { ImgHTMLAttributes } from 'react'
import styles from './Avatar.module.css'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  alt: string
  src: string
  size?: number
}

export function Avatar({ alt, className, height, size = 48, src, width, ...props }: AvatarProps) {
  const avatarClassName = [styles.avatar, className].filter(Boolean).join(' ')

  return (
    <img
      alt={alt}
      className={avatarClassName}
      height={height ?? size}
      src={src}
      width={width ?? size}
      {...props}
    />
  )
}
