import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import { CloseIcon, SearchIcon } from '../icons'
import { Input } from '../input'
import styles from './SearchInput.module.css'
import type { SearchInputProps } from './type'

const clearNativeInput = (input: HTMLInputElement) => {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  valueSetter?.call(input, '')
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    defaultValue = '',
    onChange,
    onClear,
    placeholder = 'Искать навык',
    className,
    wrapperClassName,
    inputClassName,
    clearButtonLabel = 'Очистить поиск',
    ...props
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : innerValue
  const isClearVisible = currentValue.length > 0

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInnerValue(event.target.value)
    }
    onChange?.(event)
  }

  const handleClear = () => {
    if (inputRef.current) {
      clearNativeInput(inputRef.current)
      inputRef.current.focus()
    }
    onClear?.()
  }

  return (
    <Input
      {...props}
      ref={inputRef}
      type="search"
      value={currentValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      wrapperClassName={clsx(styles.wrapper, wrapperClassName)}
      inputClassName={clsx(styles.input, inputClassName)}
      leftIcon={<SearchIcon className={styles.searchIcon} aria-hidden="true" />}
      rightIcon={
        isClearVisible ? (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label={clearButtonLabel}
          >
            <CloseIcon aria-hidden="true" />
          </button>
        ) : undefined
      }
    />
  )
})
