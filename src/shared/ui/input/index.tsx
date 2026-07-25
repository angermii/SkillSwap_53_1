import React from 'react'
import styles from './input.module.css'
import { InputProps } from './input'

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={`${styles.wrapper} ${error ? styles.error : ''}`}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input ref={ref} className={styles.input} {...props} />
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'
