import { memo, useEffect, useId } from 'react'
import clsx from 'clsx'

import { ModalOverlayUI } from './ModalOverlayUI'
import type { ModalUIProps } from './type'
import styles from './ModalUI.module.css'

export const ModalUI = memo(
  ({ title, onClose, children, icon, size = 'small', className }: ModalUIProps) => {
    const titleId = useId()

    useEffect(() => {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = previousOverflow
      }
    }, [])

    return (
      <>
        <ModalOverlayUI onClick={onClose} />

        <div
          className={clsx(styles.modal, styles[size], className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-testid="modal"
        >
          {icon && (
            <div className={styles.icon} aria-hidden="true">
              {icon}
            </div>
          )}

          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>

          <div className={styles.content}>{children}</div>
        </div>
      </>
    )
  },
)

ModalUI.displayName = 'ModalUI'
