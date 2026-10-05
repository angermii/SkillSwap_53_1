import React from 'react'

import styles from './Checkbox.module.css'

import { CheckboxDoneIcon, CheckboxEmptyIcon, CheckboxRemoveIcon } from '../icons'

export interface CheckboxProps {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  variant?: 'category' | 'subcategory'
}

export const Checkbox = ({ checked, onChange, label, variant = 'category' }: CheckboxProps) => {
  const Icon = checked
    ? variant === 'category'
      ? CheckboxRemoveIcon
      : CheckboxDoneIcon
    : CheckboxEmptyIcon

  return (
    <label className={styles.label}>
      <input type="checkbox" className={styles.input} checked={checked} onChange={onChange} />

      <Icon className={styles.icon} aria-hidden="true" />

      <span className={styles.text}>{label}</span>
    </label>
  )
}
