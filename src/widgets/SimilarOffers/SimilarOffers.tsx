import { ChevronRightIcon, IconButton } from '@/shared/ui'
import { UserCard } from '../UserCard'
import type { SimilarOffersProps } from './type'
import styles from './SimilarOffers.module.css'

export const SimilarOffers = ({ cards, onNextClick, onDetailsClick }: SimilarOffersProps) => {
  if (cards.length === 0) return null

  const visibleCards = cards.slice(0, 4)

  return (
    <section className={styles.similarOffers}>
      <h2>Похожие предложения</h2>

      <div className={styles.cards}>
        {visibleCards.map(({ skillId, user }) => (
          <UserCard key={skillId} user={user} onDetailsClick={() => onDetailsClick?.(skillId)} />
        ))}

        {cards.length >= 4 && (
          <IconButton
            icon={<ChevronRightIcon aria-hidden="true" />}
            isActive={false}
            onClick={onNextClick}
            aria-label="Показать следующие предложения"
            className={styles.nextButton}
          />
        )}
      </div>
    </section>
  )
}
