import { FavoritesWidget, Footer } from '@/widgets'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  return (
    <div className={styles.layout}>
      <main className={styles.page}>
        <FavoritesWidget headingAs="h1" />
      </main>

      <Footer />
    </div>
  )
}
