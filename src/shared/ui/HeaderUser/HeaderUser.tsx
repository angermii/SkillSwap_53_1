import clsx from 'clsx';

import { Avatar } from '../Avatar';
import { UserCircleIcon } from '../icons';
import type { HeaderUserProps } from './type';

import styles from './HeaderUser.module.css';

//Данные передаются через props, сам компонент отвечает только за отображение

export const HeaderUser = ({
  name,
  avatarSrc,
  avatarAlt,
  className,
}: HeaderUserProps) => {
  return (
    <button
      type="button"
      className={clsx(styles.user, className)}
    >
      {/* Имя текущего пользователя */}
      <span className={styles.name}>{name}</span>

      {/* Переиспользуется общий компонент Avatar, если аватара нет то тянем плейсхолдер иконку */}
      {avatarSrc ? (
        <Avatar
          src={avatarSrc}
          alt={avatarAlt ?? name}
          size={48}
        />
      ) : (
        <span className={styles.avatarPlaceholder} aria-hidden="true">
          <UserCircleIcon size={48} />
        </span>
      )}
    </button>
  );
};
