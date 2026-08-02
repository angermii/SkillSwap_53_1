import { HeaderProps } from './types'
import { useState } from 'react'
import styles from './Header.module.css'
import { Button, Dropdown, HeaderUser, Logo, SearchInput } from '@/shared/ui'
import { BellIcon, HeartIcon, MoonIcon, CloseIcon, ChevronDownIcon } from '@/shared/ui/icons'

export const Header = ({ variant = 'loggedOut' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Logo />
        {/* Основная навигация скрывается в режиме pure */}
        {variant !== 'pure' && (
          <nav className={styles.navigation}>
            <button type="button" className={styles.link}>
              О проекте
            </button>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className={styles.categoryButton}
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  {/*<div>Категории будут добавлены после merge CategorySection</div>*/}
                  <span>Все навыки</span>
                  <ChevronDownIcon />
                </button>
              }
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <div>Категории будут добавлены после merge CategorySection</div>
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
      <button className={styles.iconButton}>
        <MoonIcon />
      </button>

      <div className={styles.authActions}>
        <Button variant="secondary">Войти</Button>
        <Button>Зарегистрироваться</Button>
      </div>
    </div>
  )}

  {/* Действия для авторизованного пользователя */}
  {variant === 'loggedIn' && (
    <div className={styles.loggedInActions}>
      <div className={styles.icons}>
        <button className={styles.iconButton}>
          <MoonIcon />
        </button>

        <button className={styles.iconButton}>
          <BellIcon />
        </button>

        <button className={styles.iconButton}>
          <HeartIcon />
        </button>
      </div>

      <HeaderUser
        name="Мария"
        avatarSrc="/avatar.jpg"
      />
    </div>
  )}

  {/* Упрощенный Header с кнопкой закрытия */}
  {variant === 'pure' && (
    <Button
      variant="secondary"
      endIcon={<CloseIcon />}
    >
      Закрыть
    </Button>
  )}
</div>
    </header>
  )
}
