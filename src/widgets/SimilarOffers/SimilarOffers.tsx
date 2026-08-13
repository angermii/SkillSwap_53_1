import { useState } from 'react'
import { ChevronRightIcon, IconButton } from '@/shared/ui'
import { UserCard } from '../UserCard'
import type { SimilarOffersProps } from './type'
import styles from './SimilarOffers.module.css'

export const SimilarOffers = ({ cards, onDetailsClick, onLikeChange }: SimilarOffersProps) => {
  const [startIndex, setStartIndex] = useState(0)

  if (cards.length === 0) return null

  const visibleCards = Array.from(
    { length: Math.min(4, cards.length) },
    (_, index) => cards[(startIndex + index) % cards.length],
  )

  const handleNextClick = () => {
    setStartIndex((prev) => (prev + 1) % cards.length)
  }

  return (
    <section className={styles.similarOffers}>
      <h2>Похожие предложения</h2>

      <div className={styles.cards}>
        {visibleCards.map(({ skillId, user, isLiked, likeCount }) => (
          <UserCard
            key={skillId}
            user={user}
            isLiked={isLiked}
            likeCount={likeCount}
            onDetailsClick={() => onDetailsClick(skillId)}
            onLikeChange={() => onLikeChange(skillId)}
          />
        ))}

        {cards.length > 4 && (
          <IconButton
            icon={<ChevronRightIcon aria-hidden="true" />}
            isActive={false}
            onClick={handleNextClick}
            aria-label="Показать следующие предложения"
            className={styles.nextButton}
          />
        )}
      </div>
    </section>
  )
}
