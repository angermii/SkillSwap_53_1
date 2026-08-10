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
import { Button, Headline } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Footer, UserCard, groupSkillsByAuthor, mapUserToCardData } from '@/widgets'
import { FavoriteCard } from './FavoritesCards'
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

  const cards = useMemo<FavoriteCard[]>(() => {
    const usersById = new Map(users.map((user) => [user.id, user]))
    const skillsById = new Map(skills.map((skill) => [skill.id, skill]))
    const skillsByAuthorId = groupSkillsByAuthor(skills)

    return favoriteIds.reduce<FavoriteCard[]>((favoriteCards, skillId) => {
      const skill = skillsById.get(skillId)

      if (!skill) {
        return favoriteCards
      }

      const author = usersById.get(skill.authorId)

      if (!author) {
        return favoriteCards
      }

      favoriteCards.push({
        skillId: skill.id,
        likeCount: skill.likeCount,
        user: mapUserToCardData({
          user: author,
          skills: skillsByAuthorId.get(author.id) ?? [],
          subcategoriesById,
        }),
      })

      return favoriteCards
    }, [])
  }, [favoriteIds, skills, users, subcategoriesById])

  const handleBackToCatalog = () => {
    navigate(ROUTES.HOME)
  }

  const renderContent = () => {
    const isEmpty = favoriteIds.length === 0 || cards.length === 0
    if (isEmpty) {
      const message =
        favoriteIds.length === 0
          ? 'Вы пока ничего не добавили в избранное'
          : isLoading
            ? 'Загружаем избранное…'
            : (error ?? 'Не удалось найти избранные навыки')

      return (
        <div className={styles.empty}>
          <p className={styles.status}>{message}</p>
          <Button onClick={handleBackToCatalog}>Вернуться в каталог</Button>
        </div>
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
