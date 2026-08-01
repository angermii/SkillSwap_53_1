import { memo } from 'react'

import type { ModalOverlayUIProps } from './type'
import styles from './ModalOverlayUI.module.css'

export const ModalOverlayUI = memo(({ onClick }: ModalOverlayUIProps) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    aria-hidden="true"
    data-testid="modal-overlay"
  />
))

ModalOverlayUI.displayName = 'ModalOverlayUI'
