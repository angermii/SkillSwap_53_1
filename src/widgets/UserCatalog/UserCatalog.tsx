import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Headline } from '@/shared/ui'; 
import { UserCard } from '@/widgets/UserCard'; 
import type { UserCardData } from '@/widgets/UserCard'; 

import styles from './UserCatalog.module.css';

//код для проверки
//import { UserCatalog } from '@/widgets/UserCatalog'; 
// Точный относительный путь до файла базы данных
//import dbUsers from '../../../public/db/users.json';
//
//const CatalogPage = () => {
  // Так как в dbUsers нет города и возраста, добавляем их на лету для типизации UserCard
  //const mappedUsers = dbUsers.map((user: any) => ({
    //...user,
    //city: 'Не указан', // Заглушка
    //age: 25,           // Заглушка
    //teachTags: [],     // Заглушка
    //learnTags: []      // Заглушка
  //}));

  // Формируем 3 секции, как на макете
  //const sections = [
    //{
    //  id: 'popular',
     // title: 'Популярное',
     // isExpandable: true,
     // users: mappedUsers,
    //},
    //{
      //id: 'new',
      //title: 'Новое',
      //isExpandable: true,
      //users: mappedUsers,
    //},
    //{
      //id: 'recommend',
      //title: 'Рекомендуем',
      //isExpandable: false,
      //users: mappedUsers,
    //}
  //];

  //return (
  //  <main style={{ padding: '40px' }}>
  //    <UserCatalog sections={sections} />
  //  </main>
  //);
//};

// ОБЯЗАТЕЛЬНО: Экспорт по умолчанию, чтобы не падал React Router!
//export default CatalogPage;

export interface CatalogSection {
  id: string | number;
  title: ReactNode;
  action?: ReactNode; 
  users: UserCardData[]; 
  isExpandable?: boolean; 
}

export interface UserCatalogProps {
  sections: CatalogSection[];
  className?: string;
}

const MAX_VISIBLE_CARDS = 6; 
const INITIAL_VISIBLE_CARDS = 3;

const CatalogSectionItem = ({ section }: { section: CatalogSection }) => {
  const [visibleCount, setVisibleCount] = useState(
    section.isExpandable ? INITIAL_VISIBLE_CARDS : section.users.length
  );

  const handleToggle = () => {
    if (visibleCount > INITIAL_VISIBLE_CARDS) {
      // Если карточек больше начального лимита — сворачиваем обратно
      setVisibleCount(INITIAL_VISIBLE_CARDS);
    } else {
      // Иначе — разворачиваем, но не больше лимита в 6 штук
      setVisibleCount(Math.min(MAX_VISIBLE_CARDS, section.users.length));
    }
  };

  // Проверяем, нужна ли вообще кнопка (если юзеров 3 или меньше, кнопка не нужна)
  const needsToggleButton = section.isExpandable && section.users.length > INITIAL_VISIBLE_CARDS;
  
  // Флаг, который показывает, развернут ли список прямо сейчас
  const isExpanded = visibleCount > INITIAL_VISIBLE_CARDS;

  const actionContent = section.action ? (
    section.action
  ) : needsToggleButton ? (
    <button className={styles.seeAllButton} onClick={handleToggle}>
      {isExpanded ? 'Свернуть' : 'Смотреть все >'}
    </button>
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

export const UserCatalog = ({ sections, className }: UserCatalogProps) => {
  if (!sections?.length) {
    return null;
  }

  return (
    <div className={clsx(styles.catalog, className)}>
      {sections.map((section) => (
        <CatalogSectionItem key={section.id} section={section} />
      ))}
    </div>
  );
};