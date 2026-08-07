import { HeaderProps } from './types'
import { useState } from 'react'
import styles from './Header.module.css'
import { Button, Dropdown, HeaderUser, Logo, SearchInput } from '@/shared/ui'
import { BellIcon, HeartIcon, MoonIcon, CloseIcon, ChevronDownIcon } from '@/shared/ui/icons'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { CategoryMenu } from '@/widgets/CategoryMenu'

export const Header = ({
  variant = 'loggedOut',
  user,
  categorySections = [],
  onLoginClick,
  onRegisterClick,
  onThemeClick,
  onNotificationsClick,
  onFavoritesClick,
  onUserClick,
  onCloseClick,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={clsx(styles.header, variant === 'pure' && styles.headerPure)}>
      <div className={styles.left}>
        <Logo />
        {/* Основная навигация скрывается в режиме pure */}
        {variant !== 'pure' && (
          <nav className={styles.navigation}>
            <Link to={ROUTES.ABOUT} className={styles.link}>
              О проекте
            </Link>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <span>Все навыки</span>
                  <ChevronDownIcon />
                </button>
              }
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <CategoryMenu sections={categorySections} />
            </Dropdown>

            <div className={styles.search}>
              <SearchInput />
            </div>
          </nav>
        )}
      </div>

      {/* Правая часть Header зависит от выбранного варианта */}
      <div className={styles.actions}>
        {/* Действия для неавторизованного пользователя */}
        {variant === 'loggedOut' && (
          <div className={styles.loggedOutActions}>
            <button className={styles.iconButton} onClick={onThemeClick}>
              <MoonIcon />
            </button>

            <div className={styles.authActions}>
              <Button variant="secondary" onClick={onLoginClick}>
                Войти
              </Button>

              <Button onClick={onRegisterClick}>Зарегистрироваться</Button>
            </div>
          </div>
        )}

        {/* Действия для авторизованного пользователя */}
        {variant === 'loggedIn' && user && (
          <div className={styles.loggedInActions}>
            <div className={styles.icons}>
              <button className={styles.iconButton} onClick={onThemeClick}>
                <MoonIcon />
              </button>

              <button className={styles.iconButton} onClick={onNotificationsClick}>
                <BellIcon />
              </button>

              <button className={styles.iconButton} onClick={onFavoritesClick}>
                <HeartIcon />
              </button>
            </div>

            <HeaderUser
              name={user.name}
              avatarSrc={user.avatarUrl ?? undefined}
              onClick={onUserClick}
            />
          </div>
        )}

        {/* Упрощенный Header с кнопкой закрытия */}
        {variant === 'pure' && (
          <Button variant="secondary" endIcon={<CloseIcon />} onClick={onCloseClick}>
            Закрыть
          </Button>
        )}
      </div>
    </header>
  )
}
