import { HeaderProps } from './types'
import { useState } from 'react'
import styles from './Header.module.css'
import { AccountMenu, Button, Dropdown, HeaderUser, Logo, SearchInput } from '@/shared/ui'
import { BellIcon, HeartIcon, MoonIcon, CloseIcon, ChevronDownIcon } from '@/shared/ui/icons'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import { CategoryMenu } from '@/widgets/CategoryMenu'
import { Notifications } from '@/widgets/Notifications'

export const Header = ({
  variant = 'loggedOut',
  user,
  categorySections = [],
  searchValue,
  onSearchChange,
  notifications = [],
  readAll,
  clearAll,
  onNotificationClick,
  onLoginClick,
  onRegisterClick,
  onThemeClick,
  onFavoritesClick,
  onLogout,
  onCloseClick,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  return (
    <header className={clsx(styles.header, variant === 'pure' && styles.headerPure)}>
      <div className={styles.left}>
        <Logo hideText />
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
                  <span className={styles.span}>Все навыки</span>
                  <ChevronDownIcon className={styles.icon} />
                </button>
              }
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              contentClassName={styles.dropdownHeader}
            >
              <CategoryMenu sections={categorySections} />
            </Dropdown>

            <div className={styles.search}>
              <SearchInput
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                onClear={() => onSearchChange?.('')}
              />
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

              <button
                className={styles.iconButton}
                onClick={() => {
                  setIsNotificationsOpen((prev) => !prev)
                }}
              >
                <BellIcon />
              </button>

              <button className={styles.iconButton} onClick={onFavoritesClick}>
                <HeartIcon />
              </button>
            </div>

            <Dropdown
              trigger={
                <HeaderUser
                  className={styles.iconButton}
                  name={user.name}
                  avatarSrc={user.avatarUrl ?? undefined}
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                />
              }
              isOpen={isAccountOpen}
              onClose={() => setIsAccountOpen(false)}
              contentClassName={styles.dropdownAccount}
              align="end"
            >
              <div className={styles.mobileMenu}>
                <button className={styles.mobileMenuItem} onClick={onThemeClick}>
                  <MoonIcon />
                </button>

                <button
                  className={styles.mobileMenuItem}
                  onClick={() => {
                    setIsAccountOpen(false)
                    setIsNotificationsOpen(true)
                  }}
                >
                  <BellIcon />
                </button>

                <button className={styles.mobileMenuItem} onClick={onFavoritesClick}>
                  <HeartIcon />
                </button>
              </div>
              <AccountMenu onLogout={onLogout} />
            </Dropdown>

            {/* notifications dropdown */}
            <Dropdown
              trigger={<></>}
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
              contentClassName={styles.notificationWidget}
              align="end"
            >
              <Notifications
                notifications={notifications}
                readAll={readAll}
                clearAll={clearAll}
                onClick={onNotificationClick}
              />
            </Dropdown>
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
