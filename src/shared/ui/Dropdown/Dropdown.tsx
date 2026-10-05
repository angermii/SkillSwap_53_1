import { useEffect, useRef } from 'react'
import clsx from 'clsx'

import type { DropdownProps } from './type'
import styles from './Dropdown.module.css'

export const Dropdown = ({
  trigger,
  isOpen,
  onClose,
  children,
  align = 'start',
  className,
  contentClassName,
  ...props
}: DropdownProps) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <div {...props} ref={rootRef} className={clsx(styles.root, className)}>
      {trigger}

      {isOpen && (
        <div className={clsx(styles.content, styles[align], contentClassName)} role="menu">
          {children}
        </div>
      )}
    </div>
  )
}
