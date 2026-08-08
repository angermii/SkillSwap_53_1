import clsx from 'clsx'
import type { SkillInfoProps } from './type'
import styles from './SkillInfo.module.css'

export const SkillInfo = ({
  title,
  subtitle,
  description,
  children,
  className,
  ...props
}: SkillInfoProps) => {
  return (
    <div className={clsx(styles.container, className)} {...props}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <p className={styles.description}>{description}</p>

      {children && <div className={styles.actions}>{children}</div>}
    </div>
  )
}
