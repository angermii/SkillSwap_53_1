import type { User } from '@/shared/types'
import type { CategorySectionProps } from '@/shared/ui'

export type HeaderVariant = 'loggedOut' | 'loggedIn' | 'pure'

export type HeaderProps = {
  variant?: HeaderVariant
  user?: User
  categorySections?: CategorySectionProps[]

  // LoggedOut
  onLoginClick?: () => void
  onRegisterClick?: () => void

  // Смена темы
  onThemeClick?: () => void

  // LoggedIn
  onNotificationsClick?: () => void
  onFavoritesClick?: () => void
  onUserClick?: () => void

  // Pure
  onCloseClick?: () => void
}
