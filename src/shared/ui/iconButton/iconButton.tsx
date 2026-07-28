import clsx from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './iconButton.module.css';

export type IconButtonProps = {
  icon: ReactNode
  activeIcon?: ReactNode
  isActive: boolean
  onClick: () => void
  hasBadge?: boolean
  className?: string
  'aria-label': string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onChange'>

export const IconButton = ({
  icon,
  activeIcon,
  isActive,
  onClick,
  hasBadge = false,
  className,
  'aria-label': ariaLabel,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(styles.iconButton, className)}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {isActive && activeIcon ? activeIcon : icon}
      {hasBadge && <span className={styles.badge} aria-hidden="true" />}
    </button>
  )
}
