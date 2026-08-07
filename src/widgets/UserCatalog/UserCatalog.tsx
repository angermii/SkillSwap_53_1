import { useState, ReactNode } from 'react';
import clsx from 'clsx';

import { Headline, Button } from '@/shared/ui'; 
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
  likeCounts?: Record<string | number, number>; // Добавилf пропс для количества лайков
}


/* Кодочек для проверки компонента
import { useState } from 'react';
import { UserCatalog } from '@/widgets/UserCatalog'; 
import dbUsers from '../../../public/db/users.json';

const CatalogPage = () => {
  // Локальные стейты для хранения статуса лайка и количества лайков
  const [likedState, setLikedState] = useState<Record<string | number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string | number, number>>({});

  // Обработчик клика по кнопке "Подробнее"
  const handleDetailsClick = (id: string | number) => {
    console.log('Переход на профиль пользователя с ID:', id);
  };

  // Обработчик изменения лайка (принимает id, новое количество и статус)
  const handleLikeChange = (id: string | number, count: number, isLiked: boolean) => {
    setLikedState((prev) => ({
      ...prev,
      [id]: isLiked,
    }));
    
    // Сохраняем обновленное количество лайков
    setLikeCounts((prev) => ({
      ...prev,
      [id]: count,
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
        likeCounts={likeCounts} // Передаем стейт с цифрами в виджет
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
  likedState,
  likeCounts
}: { 
  section: CatalogSection;
  onDetailsClick?: (id: string | number) => void;
  onLikeChange?: (id: string | number, count: number, isLiked: boolean) => void;
  likedState?: Record<string | number, boolean>;
  likeCounts?: Record<string | number, number>;
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
              likeCount={likeCounts?.[user.id] || 0} // Передаем динамическое значение
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
  likedState,
  likeCounts
}: UserCatalogProps) => {
  
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
                  likeCount={likeCounts?.[user.id] || 0} // Передаем динамическое значение
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
            likeCounts={likeCounts} // Прокидываем пропс вниз
          />
        ))}
      </div>
    );
  }

  return null;
};