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
          <Link to={ROUTES.ABOUT} className={styles.link}>
            О проекте
          </Link>
          <Link to={ROUTES.HOME} className={styles.link}>
            Все навыки
          </Link>
        </div>
        <div className={styles.column}>
          <Link to="/contacts" className={styles.link}>Контакты</Link>
          <Link to="/blog" className={styles.link}>Блог</Link>
        </div>
        <div className={styles.column}>
          <Link to="/privacy" className={styles.link}>Политика конфиденциальности</Link>
          <Link to="/agreement" className={styles.link}>Пользовательское соглашение</Link>
        </div>
      </nav>
    </footer>
  )
}
