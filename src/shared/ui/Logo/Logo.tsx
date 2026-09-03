import clsx from 'clsx'
import { Link } from 'react-router-dom'

import styles from './Logo.module.css'

type LogoProps = {
  className?: string
}

/**
 * Переиспользуемый логотип SkillSwap
 * По клику ведет на главную страницу
 * className позволяет дополнить стили компонента снаружи
 */

export const Logo = ({ className }: LogoProps) => (
  <Link
    to="/"
    className={clsx(styles.logo, className)}
    aria-label="SkillSwap — перейти на главную страницу"
  >
    {/* Звезда экспортирована из фигмы и скрыта от скринридеров как декоративная */}
    <span className={styles.icon} aria-hidden="true">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 0C10 0 10.5518 5.14994 12.7009 7.29909C14.8501 9.44825 20 10 20 10C20 10 14.8501 10.5518 12.7009 12.7009C10.5518 14.8501 10 20 10 20C10 20 9.44825 14.8501 7.29909 12.7009C5.14994 10.5518 0 10 0 10C0 10 5.14994 9.44825 7.29909 7.29909C9.44825 5.14994 10 0 10 0Z"
          fill="var(--color-background)"
        />
      </svg>
    </span>

    <span className={styles.text}>SkillSwap</span>
  </Link>
)
