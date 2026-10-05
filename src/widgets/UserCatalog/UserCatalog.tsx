import { useState, ReactNode } from 'react'
import clsx from 'clsx'

import { Headline, Button, ChevronRightIcon, ChevronUpIcon, Spinner } from '@/shared/ui'
import { useInfiniteScroll } from '@/shared/lib/useInfiniteScroll'
import { UserCard } from '@/widgets/UserCard'
import type { UserCardData } from '@/widgets/UserCard'

import styles from './UserCatalog.module.css'

export interface CatalogSection {
  id: string | number
  title: ReactNode
  action?: ReactNode
  users: UserCardData[]
  isExpandable?: boolean
}

export interface UserCatalogProps {
  sections?: CatalogSection[]
  users?: UserCardData[]
  title?: ReactNode
  action?: ReactNode
  className?: string
  onDetailsClick?: (id: string | number) => void
  onLikeChange?: (id: string | number, count: number, isLiked: boolean) => void
  likedState?: Record<string | number, boolean>
  likeCounts?: Record<string | number, number>
}

const MAX_VISIBLE_CARDS = 6
const INITIAL_VISIBLE_CARDS = 3

// возвращает ID teach навыка для перехода на его страницу и работы с избранным
const getCardId = (user: UserCardData) => user.teachTags[0]?.id

const CatalogSectionItem = ({
  section,
  onDetailsClick,
  onLikeChange,
  likedState,
  likeCounts,
}: {
  section: CatalogSection
  onDetailsClick?: (id: string | number) => void
  onLikeChange?: (id: string | number, count: number, isLiked: boolean) => void
  likedState?: Record<string | number, boolean>
  likeCounts?: Record<string | number, number>
}) => {
  const [visibleCount, setVisibleCount] = useState(
    section.isExpandable ? INITIAL_VISIBLE_CARDS : section.users.length,
  )

  // Подключаем бесконечный скролл
  const { visibleItems: infiniteItems, isFetching, loaderRef } = useInfiniteScroll(section.users, 6)

  const handleToggle = () => {
    if (visibleCount > INITIAL_VISIBLE_CARDS) {
      setVisibleCount(INITIAL_VISIBLE_CARDS)
    } else {
      setVisibleCount(Math.min(MAX_VISIBLE_CARDS, section.users.length))
    }
  }

  const needsToggleButton = section.isExpandable && section.users.length > INITIAL_VISIBLE_CARDS
  const isExpanded = visibleCount > INITIAL_VISIBLE_CARDS

  const actionContent = section.action ? (
    section.action
  ) : needsToggleButton ? (
    <Button
      variant="ghost"
      endIcon={isExpanded ? <ChevronUpIcon /> : <ChevronRightIcon />}
      onClick={handleToggle}
    >
      {isExpanded ? 'Свернуть' : 'Смотреть все'}
    </Button>
  ) : null

  // Если секция Expandable - обрезаем вручную. Если нет - отдаем управление хуку скролла
  const visibleUsers = section.isExpandable ? section.users.slice(0, visibleCount) : infiniteItems

  return (
    <section className={styles.section}>
      <Headline title={section.title} action={actionContent} className={styles.header} />

      {visibleUsers.length > 0 ? (
        <>
          <div className={styles.grid}>
            {visibleUsers.map((user) => {
              const cardId = getCardId(user)
              if (cardId === undefined) return null
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  variant="compact"
                  isLiked={likedState?.[cardId] ?? false}
                  likeCount={likeCounts?.[cardId] ?? 0}
                  onDetailsClick={() => onDetailsClick?.(cardId)}
                  onLikeChange={(count, isLiked) => onLikeChange?.(cardId, count, isLiked)}
                />
              )
            })}
          </div>

          {/* Вернули проверку: спиннер и лоадер только для секции "Рекомендуем" */}
          {!section.isExpandable && (
            <>
              {isFetching && <Spinner />}
              <div ref={loaderRef} style={{ height: '20px' }} />
            </>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <p>В этой секции пока нет пользователей.</p>
        </div>
      )}
    </section>
  )
}

export const UserCatalog = ({
  sections,
  users,
  title,
  action,
  className,
  onDetailsClick,
  onLikeChange,
  likedState,
  likeCounts,
}: UserCatalogProps) => {
  // Хук для состояния с фильтрами (когда передан плоский массив users)
  const { visibleItems: infiniteUsers, isFetching, loaderRef } = useInfiniteScroll(users || [], 6)

  if (users) {
    return (
      <div className={clsx(styles.catalog, className)}>
        <section className={styles.section}>
          {title && <Headline title={title} action={action} className={styles.header} />}
          {infiniteUsers.length > 0 ? (
            <>
              <div className={styles.grid}>
                {infiniteUsers.map((user) => {
                  const cardId = getCardId(user)
                  if (cardId === undefined) return null
                  return (
                    <UserCard
                      key={user.id}
                      user={user}
                      variant="compact"
                      isLiked={likedState?.[cardId] ?? false}
                      likeCount={likeCounts?.[cardId] ?? 0}
                      onDetailsClick={() => onDetailsClick?.(cardId)}
                      onLikeChange={(count, isLiked) => onLikeChange?.(cardId, count, isLiked)}
                    />
                  )
                })}
              </div>

              {/* Спиннер и лоадер для плоского списка (состояние с фильтрами) */}
              {isFetching && <Spinner />}
              <div ref={loaderRef} style={{ height: '20px' }} />
            </>
          ) : (
            <div className={styles.empty}>
              <p>По вашему запросу ничего не найдено.</p>
            </div>
          )}
        </section>
      </div>
    )
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
            likeCounts={likeCounts}
          />
        ))}
      </div>
    )
  }

  return null
}
