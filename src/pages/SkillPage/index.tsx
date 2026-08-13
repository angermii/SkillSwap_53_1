// TODO: реализовать страницу SkillPage

import {
  Footer,
  groupSkillsByAuthor,
  mapUserToCardData,
  UserCard,
  UserSkillWidget,
} from '@/widgets'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { useEffect, useMemo, useState } from 'react'
import Styles from './SkillPage.module.css'
import {
  fetchSkill,
  fetchSkillById,
  fetchSkillByUserId,
} from '@/entities/skill/model/skillSlice.ts'
import { fetchUserById, fetchUsers } from '@/entities/user/model/userSlice.ts'
import { Button, ClockIcon, ModalUI, NotificationIcon } from '@/shared/ui'
import {
  selectSelectedSkill,
  selectSelectedSkillLoading,
  selectSkillCategoryById,
  selectSkills,
  selectSkillSubcategoriesById,
  selectSkillSubcategoryById,
} from '@/entities/skill/model/selectors'
import { ROUTES } from '@/shared/lib/constants.ts'
import { toggleFavorite } from '@/features/favorites'
import { createRequest } from '@/entities/request/requestsSlice.ts'
import { toGalleryImages } from '@/widgets/GalleryCarousel'

export default function SkillPage() {
  //находим навык по url
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const skill = useAppSelector(selectSelectedSkill)
  //Нужно найти id пользователя залогиненного, либо редирект(недоделано)
  const currentUser = ''
  //находим пользователя, которому принадлежит навык
  const userId = skill?.authorId
  const selectedUser = useAppSelector((state) => state.user.user)
  //все навыки, связанные с пользователем
  const userSkills = useAppSelector((state) => state.skill.userSkills)
  const subcategory = useAppSelector((state) =>
    skill?.subcategoryId ? selectSkillSubcategoryById(state, skill.subcategoryId) : null,
  )
  const category = useAppSelector((state) =>
    subcategory?.categoryId ? selectSkillCategoryById(state, subcategory.categoryId) : null,
  )
  const users = useAppSelector((state) => state.user.items)
  const skills = useAppSelector(selectSkills)
  const subcategoriesById = useAppSelector(selectSkillSubcategoriesById)
  const isLoading = useAppSelector(selectSelectedSkillLoading)
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isRequested, setIsRequested] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      void dispatch(fetchSkillById(id))
        .unwrap()
        .then((fetchedSkill) => {
          if (!fetchedSkill) {
            navigate('/404', { replace: true })
          }
        })
        .catch(() => {
          navigate('/404', { replace: true })
        })
    }
  }, [dispatch, id, navigate])

  useEffect(() => {
    void dispatch(fetchUsers())
    void dispatch(fetchSkill())
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (userId) {
      void dispatch(fetchUserById(userId))
      void dispatch(fetchSkillByUserId(userId))
    }
  }, [dispatch, userId])

  //похожие предложения собираются по подкатегориям навыков
  const similarUsersCards = useMemo(() => {
    if (!subcategory?.id || !skills.length || !users.length) return []

    const skillsByAuthor = groupSkillsByAuthor(skills)
    const filteredAuthors = Array.from(skillsByAuthor.entries()).filter(
      ([authorId, authorSkills]) => {
        if (authorId === userId) return false
        return authorSkills.some((s) => s.type === 'teach' && s.subcategoryId === subcategory.id)
      },
    )

    return filteredAuthors
      .map(([authorId, authorSkills]) => {
        const currentAuthorData = users.find((u) => u.id === authorId)

        if (!currentAuthorData) return null

        return mapUserToCardData({
          user: currentAuthorData,
          skills: authorSkills,
          subcategoriesById,
        })
      })
      .filter((userCard): userCard is NonNullable<typeof userCard> => userCard !== null)
  }, [skills, subcategory?.id, users, subcategoriesById, userId])

  const galleryImages = useMemo(
    () => toGalleryImages(skill?.imageUrl, { idPrefix: skill?.id, altPrefix: skill?.title }),
    [skill?.id, skill?.imageUrl, skill?.title],
  )

  const handleRequest = () => {
    if (!skill?.id || !userId) return
    //добавить проверку на успех запроса(возможно)
    void dispatch(
      createRequest({
        skillId: skill.id,
        //здесь добавить id пользователя
        fromUserId: '',
        toUserId: userId,
      }),
    )
    setIsOpenModal(true)
    setIsRequested(true)
  }

  if (isLoading || !skill || !selectedUser || !subcategory || !category) {
    return (
      <main className={Styles.Main}>
        <p>Загрузка данных...</p>
        <Footer />
      </main>
    )
  }

  const user = mapUserToCardData({
    user: selectedUser,
    skills: userSkills,
    subcategoriesById,
  })

  return (
    <main className={Styles.Main}>
      {isOpenModal && (
        <ModalUI
          title={'Вы предложили обмен'}
          description={'Теперь дождитесь подтверждения. Вам придёт уведомление'}
          icon={<NotificationIcon size={100} />}
          onClose={() => setIsOpenModal(false)}
        >
          <Button type="button" onClick={() => setIsOpenModal(false)}>
            <span>Готово</span>
          </Button>
        </ModalUI>
      )}
      <div className={Styles.Skill}>
        <UserCard user={user} variant={'expanded'} />
        <UserSkillWidget
          like={{ count: 10, isLiked: false }}
          skill={{
            title: skill.title,
            subtitle: `${category.title} / ${subcategory.title}`,
            description: skill.description,
          }}
          className={Styles.SkillWidget}
          gallery={{ images: galleryImages, maxThumbnails: 3 }}
          actions={
            <Button
              variant={isRequested ? 'secondary' : 'primary'}
              startIcon={isRequested ? <ClockIcon /> : undefined}
              type="button"
              onClick={isRequested ? () => {} : handleRequest}
            >
              <span>{isRequested ? 'Обмен предложен' : 'Предложить обмен'}</span>
            </Button>
          }
        />
      </div>
      <div className={Styles.SimilarVariants}>
        <h2>Похожие предложения</h2>
        <div className={Styles.Cards}>
          {similarUsersCards.length > 0 ? (
            similarUsersCards.map((cardData) => (
              <UserCard
                key={cardData?.id}
                user={cardData}
                variant={'compact'}
                onDetailsClick={() =>
                  navigate(generatePath(ROUTES.SKILL, { id: cardData?.teachTags[0]?.id }))
                }
                onLikeChange={() => dispatch(toggleFavorite(cardData?.teachTags[0]?.id))}
              />
            ))
          ) : (
            <p>Похожих предложений пока нет</p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

//еще не добавлена карусель для карточек похожие предложения как в макете
//фото в userSkillWidget не прогружаются
