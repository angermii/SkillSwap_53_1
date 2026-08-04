import type { UserCardData } from '../UserCard'

export type SimilarOfferData = {
  skillId: string
  user: UserCardData
}

export type SimilarOffersProps = {
  cards: SimilarOfferData[]
  onNextClick: () => void
  onDetailsClick?: (skillId: string) => void
}