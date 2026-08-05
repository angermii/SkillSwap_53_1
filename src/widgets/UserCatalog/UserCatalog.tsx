import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import { Headline } from '@/shared/ui'; 
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
  sections: CatalogSection[];
  className?: string;
}

const CatalogSectionItem = ({ section }: { section: CatalogSection }) => {
  // Хук useState теперь правильно импортирован из 'react' сверху
  const [visibleCount, setVisibleCount] = useState(
    section.isExpandable ? 3 : section.users.length
  );

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const hasMore = section.isExpandable && visibleCount < section.users.length;

  const actionContent = section.action ? (
    section.action
  ) : hasMore ? (
    <button className={styles.seeAllButton} onClick={handleShowMore}>
      Смотреть все &gt;
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