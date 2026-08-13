import type { UserCardData } from '../UserCard'

export type SimilarOfferData = {
  skillId: string
  user: UserCardData
  isLiked: boolean
  likeCount: number
}

export type SimilarOffersProps = {
  cards: SimilarOfferData[]
  onDetailsClick: (skillId: string) => void
  onLikeChange: (skillId: string) => void
}
