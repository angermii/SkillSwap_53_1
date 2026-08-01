import { HeaderProps } from './types';
import { Logo } from '@/shared/ui/Logo';
import { Dropdown } from '@/shared/ui';
import { useState } from 'react';
import { SearchInput } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { Avatar } from '@/shared/ui';
import styles from './Header.module.css';
import {
  BellIcon,
  HeartIcon,
  MoonIcon,
  CloseIcon,
  ChevronDownIcon,
} from '@/shared/ui/icons';

export const Header = ({ variant = 'loggedOut' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
  <div className={styles.left}>
    <Logo />

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

  <div className={styles.actions}>
    {variant === 'loggedOut' && (
      <>
        <button className={styles.iconButton}>
          <MoonIcon />
        </button>

        <Button variant="secondary">Войти</Button>

        <Button>Зарегистрироваться</Button>
      </>
    )}

    {variant === 'loggedIn' && (
      <>
        <button className={styles.iconButton}>
          <MoonIcon />
        </button>

        <button className={styles.iconButton}>
          <BellIcon />
        </button>

        <button className={styles.iconButton}>
          <HeartIcon />
        </button>

        <button className={styles.user}>
          <span>Мария</span>

          <Avatar
            src="/avatar.jpg"
            alt="Мария"
            size={32}
          />
        </button>
      </>
    )}

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
  );
};
