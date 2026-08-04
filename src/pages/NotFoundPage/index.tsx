import { useNavigate } from 'react-router-dom'
import { Error, Button } from '@/shared/ui'
import { Footer } from '@/widgets'
import { ROUTES } from '@/shared/lib/constants'
import error404 from '@/shared/illustrations/error404.svg'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <main className={styles.main}>
        <Error
          errorImg={error404}
          imageWidth={460}
          imageHeight={304}
          title="Страница не найдена"
          description="К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
        >
          <Button variant="secondary">Сообщить об ошибке</Button>
          <Button variant="primary" onClick={() => navigate(ROUTES.HOME)}>
            На главную
          </Button>
        </Error>
      </main>
      <Footer />
    </>
  )
}
