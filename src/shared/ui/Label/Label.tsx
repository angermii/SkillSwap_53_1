import clsx from 'clsx'

import styles from './Label.module.css'
import type { LabelProps } from './type'

export const Label = ({ text, color }: LabelProps) => {
  return <span className={clsx(styles.label, styles[color])}>{text}</span>
}
