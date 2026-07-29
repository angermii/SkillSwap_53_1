import clsx from 'clsx'

import type { OnboardingProps } from './type'
import styles from './Onboarding.module.css'

export const Onboarding = ({
  illustration,
  title,
  description,
  className,
  ...props
}: OnboardingProps) => {
  return (
    <div {...props} className={clsx(styles.onboarding, className)}>
      <div className={styles.illustration} aria-hidden="true">
        {illustration}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
