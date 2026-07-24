import clsx from 'clsx'

import type { ButtonProps } from './type'
import styles from './Button.module.css'

export const Button = ({
  children,
  variant = 'primary',
  startIcon,
  endIcon,
  className,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button {...props} type={type} className={clsx(styles.button, styles[variant], className)}>
      {startIcon && (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      )}

      {children}

      {endIcon && (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  )
}
