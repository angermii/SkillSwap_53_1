import type { HTMLAttributes } from 'react'
import type { HeadlineTag } from '@/shared/ui'
import type { UserCardData } from '../UserCard'

export type FavoriteCard = {
  skillId: string
  user: UserCardData
  likeCount: number
}

export interface FavoritesWidgetProps extends HTMLAttributes<HTMLElement> {
  headingAs?: HeadlineTag
}
