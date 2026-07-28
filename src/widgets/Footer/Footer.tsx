import { Logo } from '@/shared/ui'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './Footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <Logo />
        <span className={styles.copyright}>SkillSwap — 2025</span>
      </div>
      <nav className={styles.nav}>
        <div className={styles.column}>
          <Link to="/about" className={styles.link}>
            О проекте
          </Link>
          <Link to={ROUTES.HOME} className={styles.link}>
            Все навыки
          </Link>
        </div>
        <div className={styles.column}>
          <span className={styles.text}>Контакты</span>
          <span className={styles.text}>Блог</span>
        </div>
        <div className={styles.column}>
          <span className={styles.text}>Политика конфиденциальности</span>
          <span className={styles.text}>Пользовательское соглашение</span>
        </div>
      </nav>
    </footer>
  )
}
