import { LightBulbIllustration } from '@/shared/illustrations'
import { Onboarding } from '@/shared/ui'
import { AuthForm } from '@/widgets'
import styles from './LoginPage.module.css'
import { ROUTES } from '@/shared/lib/constants'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const handleSubmit = () => {}

  const navigate = useNavigate()

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER)
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Вход</h1>

      <div className={styles.panels}>
        <AuthForm variant="login" onSubmit={handleSubmit} onLinkClick={handleRegisterClick} />

        <Onboarding
          illustration={<LightBulbIllustration />}
          title="С возвращением в SkillSwap!"
          description="Обменивайтесь знаниями и навыками с другими людьми"
        />
      </div>
    </main>
  )
}
