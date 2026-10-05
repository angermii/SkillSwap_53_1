import { useEffect, useRef, useState } from 'react'
import { ChevronRightIcon, IconButton } from '@/shared/ui'
import { UserCard } from '../UserCard'
import type { SimilarOffersProps } from './type'
import styles from './SimilarOffers.module.css'

const minCardWidth = 285
const gap = 24

export const SimilarOffers = ({ cards, onDetailsClick, onLikeChange }: SimilarOffersProps) => {
  const [startIndex, setStartIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(1)

  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = cardsRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width

      const count = Math.max(1, Math.floor((width + gap) / (minCardWidth + gap)))
      setVisibleCount(Math.min(count, cards.length))
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [cards.length])

  if (cards.length === 0) return null

  const visibleCards = Array.from(
    { length: visibleCount },
    (_, index) => cards[(startIndex + index) % cards.length],
  )

  const handleNextClick = () => {
    setStartIndex((prev) => (prev + 1) % cards.length)
  }

  return (
    <section className={styles.similarOffers}>
      <h2>Похожие предложения</h2>

      <div
        ref={cardsRef}
        className={styles.cards}
        style={{
          gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))`,
        }}
      >
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

        {cards.length > visibleCount && (
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
