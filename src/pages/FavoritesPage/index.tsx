import { useEffect, useMemo, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { fetchSkillSubcategories } from '@/api/skills'
import { fetchSkill } from '@/entities/skill/model/skillSlice'
import { fetchUsers } from '@/entities/user/model/userSlice'
import { toggleFavorite } from '@/features/favorites'
import { ROUTES } from '@/shared/lib/constants'
import type { SkillSubcategory } from '@/shared/types'
import { Headline } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Footer, UserCard } from '@/widgets'
import { FavoriteCards } from './FavoritesCards'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // id лайкнутых навыков из слайса favorites
  const favoriteIds = useAppSelector((state) => state.favorites.ids)
  const skills = useAppSelector((state) => state.skill.skills)
  const users = useAppSelector((state) => state.user.items)
  const isLoading = useAppSelector((state) => state.skill.loading || state.user.loading)
  const error = useAppSelector((state) => state.skill.error ?? state.user.error)

  // подкатегории нужны только для тегов, отдельного слайса под них нет
  const [subcategories, setSubcategories] = useState<SkillSubcategory[]>([])

  useEffect(() => {
    void dispatch(fetchSkill())
    void dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    let isActive = true

    fetchSkillSubcategories()
      .then((items) => {
        if (isActive) setSubcategories(items)
      })
      .catch(() => {
        if (isActive) setSubcategories([])
      })

    return () => {
      isActive = false
    }
  }, [])

  const cards = useMemo(
    () => FavoriteCards({ favoriteIds, skills, users, subcategories }),
    [favoriteIds, skills, users, subcategories],
  )

  const renderContent = () => {
    if (favoriteIds.length === 0) {
      return <p className={styles.status}>Вы пока ничего не добавили в избранное</p>
    }

    if (cards.length === 0) {
      return (
        <p className={styles.status}>
          {isLoading ? 'Загружаем избранное…' : (error ?? 'Не удалось найти избранные навыки')}
        </p>
      )
    }

    return (
      <div className={styles.grid}>
        {cards.map(({ skillId, user, likeCount }) => (
          <UserCard
            key={skillId}
            user={user}
            isLiked
            likeCount={likeCount}
            onDetailsClick={() => navigate(generatePath(ROUTES.SKILL, { id: skillId }))}
            onLikeChange={() => dispatch(toggleFavorite(skillId))}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <main className={styles.page}>
        <Headline as="h1" title="Избранное" />
        {renderContent()}
      </main>

      <Footer />
    </>
  )
}
