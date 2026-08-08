import type { User } from '@/shared/types'
import type { CategorySectionProps, Notification } from '@/shared/ui'


export type HeaderVariant = 'loggedOut' | 'loggedIn' | 'pure'

export type HeaderProps = {
  variant?: HeaderVariant
  user?: User
  categorySections?: CategorySectionProps[]
  notifications?: Notification[]

  // Уведомления
  readAll?: () => void
  clearAll?: () => void
  onNotificationClick?: () => void

  // LoggedOut
  onLoginClick?: () => void
  onRegisterClick?: () => void

  // Смена темы
  onThemeClick?: () => void

  // LoggedIn
  onFavoritesClick?: () => void
  onUserClick?: () => void

  // Pure
  onCloseClick?: () => void
}
