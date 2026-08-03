import type { HTMLAttributes } from 'react'
import type { CardTagsProps } from '@/shared/ui'

/** compact - карточка каталога с лайком и кнопкой "подробнее"
 *  expanded - карточка с описанием пользователя
 */
export type UserCardVariant = 'compact' | 'expanded'

export type UserCardData = {
  id: string
  name: string
  city: string
  age: number
  avatarUrl?: string | null
  description?: string
  teachTags: CardTagsProps['teachTags']
  learnTags: CardTagsProps['learnTags']
}

export type UserCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  user: UserCardData
  variant?: UserCardVariant
  isLiked?: boolean
  likeCount?: number
  onDetailsClick?: (userId: string) => void
  onLikeChange?: (userId: string, count: number, isLiked: boolean) => void
}
