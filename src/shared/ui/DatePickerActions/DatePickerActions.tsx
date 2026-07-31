import clsx from 'clsx'

import { Button } from '../Button'
import type { DatePickerActionsProps } from './type'
import styles from './DatePickerActions.module.css'

export const DatePickerActions = ({
  onConfirm,
  onCancel,
  confirmText = 'Выбрать',
  cancelText = 'Отменить',
  confirmDisabled,
  className,
  ...props
}: DatePickerActionsProps) => {
  return (
    <div {...props} className={clsx(styles.actions, className)}>
      <Button type="button" variant="secondary" className={styles.button} onClick={onCancel}>
        {cancelText}
      </Button>

      <Button
        type="button"
        variant="primary"
        className={styles.button}
        onClick={onConfirm}
        disabled={confirmDisabled}
      >
        {confirmText}
      </Button>
    </div>
  )
}
