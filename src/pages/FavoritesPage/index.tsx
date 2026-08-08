import { useEffect, useMemo } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import {
  selectSkills,
  selectSkillSubcategoriesById,
  selectSkillSubcategoriesError,
  selectSkillSubcategoriesLoading,
  selectSkillsError,
  selectSkillsLoading,
} from '@/entities/skill/model/selectors'
import { fetchSkill, fetchSkillSubcategories } from '@/entities/skill/model/skillSlice'
import { fetchUsers } from '@/entities/user/model/userSlice'
import { toggleFavorite } from '@/features/favorites'
import { ROUTES } from '@/shared/lib/constants'
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
  const skills = useAppSelector(selectSkills)
  const users = useAppSelector((state) => state.user.items)
  // подкатегории нужны для тегов карточки — теперь берём их из слайса skill
  const subcategoriesById = useAppSelector(selectSkillSubcategoriesById)

  // у каждого запроса свой флаг, поэтому объединяем их явно на уровне страницы
  const isLoading = useAppSelector(
    (state) =>
      selectSkillsLoading(state) || selectSkillSubcategoriesLoading(state) || state.user.loading,
  )
  const error = useAppSelector(
    (state) => selectSkillsError(state) ?? selectSkillSubcategoriesError(state) ?? state.user.error,
  )

  useEffect(() => {
    void dispatch(fetchSkill())
    void dispatch(fetchUsers())
    void dispatch(fetchSkillSubcategories())
  }, [dispatch])

  const cards = useMemo(
    () => FavoriteCards({ favoriteIds, skills, users, subcategoriesById }),
    [favoriteIds, skills, users, subcategoriesById],
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
    <div className={styles.layout}>
      <main className={styles.page}>
        <Headline as="h1" title="Избранное" />
        {renderContent()}
      </main>

      <Footer />
    </div>
  )
}
