import { ReactNode, useState } from 'react';
import clsx from 'clsx';

import { Headline, Button } from '@/shared/ui'; //импортирую button
import { UserCard } from '@/widgets/UserCard'; 
import type { UserCardData } from '@/widgets/UserCard'; 

import styles from './UserCatalog.module.css';


export interface CatalogSection {
  id: string | number;
  title: ReactNode;
  action?: ReactNode; 
  users: UserCardData[]; 
  isExpandable?: boolean; 
}

export interface UserCatalogProps {
  sections?: CatalogSection[]; 
  users?: UserCardData[];      
  title?: ReactNode;           
  action?: ReactNode;          
  className?: string;
  onDetailsClick?: (id: string | number) => void;
  onLikeChange?: (id: string | number, count: number, isLiked: boolean) => void;
  likedState?: Record<string | number, boolean>;
}

/* Кодочек для проверки. Вставляю в файл src/pages/CatalogPage/index.tsx
import { useState } from 'react';
import { UserCatalog } from '@/widgets/UserCatalog'; 
import dbUsers from '../../../public/db/users.json';

const CatalogPage = () => {
  // Локальный стейт для хранения лайков (пока не подключен глобальный стор)
  const [likedState, setLikedState] = useState<Record<string | number, boolean>>({});

  // Обработчик клика по кнопке "Подробнее"
  const handleDetailsClick = (id: string | number) => {
    console.log('Переход на профиль пользователя с ID:', id);
  };

  // Обработчик изменения лайка
  const handleLikeChange = (id: string | number, count: number, isLiked: boolean) => {
    setLikedState((prev) => ({
      ...prev,
      [id]: isLiked,
    }));
  };

  const mappedUsers = dbUsers.map((user: any) => ({
    ...user,
    city: 'Не указан', 
    age: 25,           
    teachTags: [],     
    learnTags: []      
  }));

  const sections = [
    {
      id: 'popular',
      title: 'Популярное',
      isExpandable: true,
      users: mappedUsers,
    },
    {
      id: 'new',
      title: 'Новое',
      isExpandable: true,
      users: mappedUsers,
    },
    {
      id: 'recommend',
      title: 'Рекомендуем',
      isExpandable: false,
      users: mappedUsers,
    }
  ];

  return (
    <main style={{ padding: '40px' }}>
      <UserCatalog 
        sections={sections} 
        onDetailsClick={handleDetailsClick}
        onLikeChange={handleLikeChange}
        likedState={likedState}
      />
    </main>
  );
};

export default CatalogPage;
*/



const MAX_VISIBLE_CARDS = 6; 
const INITIAL_VISIBLE_CARDS = 3;

const CatalogSectionItem = ({ 
  section, 
  onDetailsClick, 
  onLikeChange, 
  likedState 
}: { 
  section: CatalogSection;
  onDetailsClick?: (id: string | number) => void;
  onLikeChange?: (id: string | number, count: number, isLiked: boolean) => void;
  likedState?: Record<string | number, boolean>;
}) => {
  const [visibleCount, setVisibleCount] = useState(
    section.isExpandable ? INITIAL_VISIBLE_CARDS : section.users.length
  );

  const handleToggle = () => {
    if (visibleCount > INITIAL_VISIBLE_CARDS) {
      setVisibleCount(INITIAL_VISIBLE_CARDS);
    } else {
      setVisibleCount(Math.min(MAX_VISIBLE_CARDS, section.users.length));
    }
  };

  const needsToggleButton = section.isExpandable && section.users.length > INITIAL_VISIBLE_CARDS;
  const isExpanded = visibleCount > INITIAL_VISIBLE_CARDS;

  const actionContent = section.action ? (
    section.action
  ) : needsToggleButton ? (
    <Button variant="ghost" onClick={handleToggle}>
      {isExpanded ? 'Свернуть' : 'Смотреть все >'}
    </Button>
  ) : null;

  const visibleUsers = section.users.slice(0, visibleCount);

  return (
    <section className={styles.section}>
      <Headline 
        title={section.title} 
        action={actionContent} 
        className={styles.header}
      />

      {visibleUsers.length > 0 ? (
        <div className={styles.grid}>
          {visibleUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              variant="compact" 
              isLiked={likedState?.[user.id] || false}
              likeCount={0} 
              onDetailsClick={onDetailsClick}
              onLikeChange={onLikeChange}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>В этой секции пока нет пользователей.</p>
        </div>
      )}
    </section>
  );
};

export const UserCatalog = ({ 
  sections, 
  users, 
  title, 
  action, 
  className,
  onDetailsClick,
  onLikeChange,
  likedState
}: UserCatalogProps) => {
  
  // 1. Если передан плоский массив пользователей (режим фильтрации)
  if (users) {
    return (
      <div className={clsx(styles.catalog, className)}>
        <section className={styles.section}>
          {title && (
            <Headline 
              title={title} 
              action={action} 
              className={styles.header} 
            />
          )}
          {users.length > 0 ? (
            <div className={styles.grid}>
              {users.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  variant="compact" 
                  isLiked={likedState?.[user.id] || false}
                  likeCount={0}
                  onDetailsClick={onDetailsClick}
                  onLikeChange={onLikeChange}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>По вашему запросу ничего не найдено.</p>
            </div>
          )}
        </section>
      </div>
    );
  }

  // 2. Если передан массив секций (режим главной страницы)
  if (sections?.length) {
    return (
      <div className={clsx(styles.catalog, className)}>
        {sections.map((section) => (
          <CatalogSectionItem 
            key={section.id} 
            section={section} 
            onDetailsClick={onDetailsClick}
            onLikeChange={onLikeChange}
            likedState={likedState}
          />
        ))}
      </div>
    );
  }

  return null;
};