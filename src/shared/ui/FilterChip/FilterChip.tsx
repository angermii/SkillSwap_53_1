import { IconButton } from '../iconButton'
import { CloseIcon } from '../icons'

import styles from './FilterChip.module.css'

export type FilterChipProps = {
  label: string
  onRemove: () => void
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className={styles.chip}>
      <span className={styles.label}>{label}</span>

      <IconButton
        icon={<CloseIcon />}
        isActive={false}
        onClick={onRemove}
        aria-label={`Удалить фильтр «${label}»`}
      />
    </div>
  )
}