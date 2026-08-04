import type { UserCardData } from '../UserCard'

export type SimilarOfferData = {
  skillId: string
  user: UserCardData
  isLiked: boolean
  likeCount: number
}

export type SimilarOffersProps = {
  cards: SimilarOfferData[]
  onNextClick: () => void
  onDetailsClick: (skillId: string) => void
  onLikeChange: (skillId: string, count: number, isLiked: boolean) => void
}
