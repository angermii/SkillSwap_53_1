import React from 'react'
import styles from './input.module.css'
import { InputProps, InputRef } from './input'

export const Input = React.forwardRef<InputRef, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className,
      wrapperClassName,
      inputClassName,
      multiline,
      invalid,
      ...props
    },
    ref,
  ) => {
    const fieldClassName = [styles.input, inputClassName].filter(Boolean).join(' ')
    const hasError = Boolean(error) || invalid

    return (
      <div className={[styles.container, className].filter(Boolean).join(' ')}>
        {label && <label className={styles.label}>{label}</label>}

        <div
          className={[
            styles.wrapper,
            multiline && styles.wrapperMultiline,
            hasError && error && styles.error,
            wrapperClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          {multiline ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              className={`${fieldClassName} ${styles.textarea}`}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={fieldClassName}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export type { InputProps, InputRef } from './input'
