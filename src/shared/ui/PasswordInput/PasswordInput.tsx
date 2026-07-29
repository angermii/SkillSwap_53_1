import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import { HidePasswordIcon, ViewPasswordIcon } from '../icons'
import { Input } from '../input'
import styles from './PasswordInput.module.css'
import type { PasswordInputProps } from './type'

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    value,
    defaultValue = '',
    onChange,
    label = 'Пароль',
    error,
    hint = 'Пароль должен содержать не менее 8 знаков',
    placeholder = 'Придумайте надёжный пароль',
    className,
    wrapperClassName,
    inputClassName,
    isVisible,
    onVisibilityChange,
    showLabel = 'Показать пароль',
    hideLabel = 'Скрыть пароль',
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : innerValue
  const [innerVisible, setInnerVisible] = useState(false)
  const isVisibilityControlled = isVisible !== undefined
  const visible = isVisibilityControlled ? isVisible : innerVisible

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInnerValue(event.target.value)
    }

    onChange?.(event)
  }

  const toggleVisibility = () => {
    const next = !visible

    if (!isVisibilityControlled) {
      setInnerVisible(next)
    }

    onVisibilityChange?.(next)

    const input = inputRef.current
    if (input) {
      const caret = input.value.length
      input.focus()
      requestAnimationFrame(() => input.setSelectionRange(caret, caret))
    }
  }

  const isHintVisible = Boolean(hint) && !error

  return (
    <div className={clsx(styles.root, className)}>
      <Input
        {...props}
        ref={inputRef}
        type={visible ? 'text' : 'password'}
        label={label}
        error={error}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        wrapperClassName={clsx(styles.wrapper, wrapperClassName)}
        inputClassName={clsx(styles.input, inputClassName)}
        rightIcon={
          <button
            type="button"
            className={styles.toggleButton}
            onClick={toggleVisibility}
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
          >
            {visible ? (
              <HidePasswordIcon aria-hidden="true" />
            ) : (
              <ViewPasswordIcon aria-hidden="true" />
            )}
          </button>
        }
      />

      {isHintVisible && <span className={styles.hint}>{hint}</span>}
    </div>
  )
})
