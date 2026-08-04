import type { User } from '@/shared/types'

export type HeaderVariant = 'loggedOut' | 'loggedIn' | 'pure'

export type HeaderProps = {
  variant?: HeaderVariant
  user?: User;

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
