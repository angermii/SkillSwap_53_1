import {
  groupSkillsByAuthor,
  mapUserToCardData,
  SimilarOffers,
  UserCard,
  UserSkillWidget,
} from '@/widgets'
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts'
import { ReactNode, useEffect, useMemo, useState } from 'react'
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
import { createRequest, selectOutgoingRequestBySkill } from '@/entities/request/requestsSlice.ts'
import { toGalleryImages } from '@/widgets/GalleryCarousel'
import { useLike } from '@/features/favorites/model/useLike'
import { selectUserById } from '@/entities/user/model/selectors'

export default function SkillPage() {
  //находим навык по url
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const skill = useAppSelector(selectSelectedSkill)
  //текущий залогиненный пользователь
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const currentUser = useAppSelector((state) => state.auth.user)
  //находим пользователя, которому принадлежит навык
  const userId = skill?.authorId
  const selectedUser = useAppSelector((state) => selectUserById(state, userId))
  const isLoadingUser = useAppSelector((state) => state.user.loading)
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

  // лайки
  const {
    likedState,
    likeCounts,
    handleLike,
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
    closeRegistrationModal,
  } = useLike({ skills })

  // уже отправленная заявка по этому навыку, чтобы не создавать дубли
  const outgoingRequest = useAppSelector((state) =>
    selectOutgoingRequestBySkill(state, skill?.id, currentUser?.id),
  )
  const isRequested = outgoingRequest !== null

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)

  const [pendingRequestData, setPendingRequestData] = useState<{
    skillId: string
    authorId: string
  } | null>(null)

  useEffect(() => {
    const state = location.state as {
      openModal?: string
      skillId?: string
      authorId?: string
    } | null

    if (state?.openModal === 'auth') {
      if (state.skillId && state.authorId) {
        setPendingRequestData({
          skillId: state.skillId,
          authorId: state.authorId,
        })
      }

      setIsAuthModalOpen(false)
      navigate(location.pathname, { replace: true, state: {} })
    }

    if (state?.openModal === 'registration') {
      setIsRegistrationModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate, setIsRegistrationModalOpen])

  useEffect(() => {
    if (pendingRequestData && isAuthenticated && currentUser) {
      const { skillId, authorId } = pendingRequestData

      const isAlreadyRequested = skill?.id === skillId ? isRequested : false

      if (!isAlreadyRequested) {
        dispatch(
          createRequest({
            skillId: skillId,
            fromUserId: currentUser.id,
            toUserId: authorId,
          }),
        )

        setIsOpenModal(true)
      }

      setPendingRequestData(null)
    }
  }, [pendingRequestData, isAuthenticated, currentUser, skill?.id, isRequested, dispatch])

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
  const similarOffers = useMemo(() => {
    if (!category?.id || !skills.length || !users.length) return []

    const skillsByAuthor = groupSkillsByAuthor(skills)

    return Array.from(skillsByAuthor.entries())
      .filter(([authorId, authorSkills]) => {
        // Не показываем самого автора текущего навыка
        if (authorId === userId) {
          return false
        }

        return authorSkills.some((item) => {
          if (item.type !== 'teach') {
            return false
          }

          const itemSubcategory = subcategoriesById.get(item.subcategoryId)

          return itemSubcategory?.categoryId === category.id
        })
      })
      .map(([authorId, authorSkills]) => {
        const author = users.find((user) => user.id === authorId)

        if (!author) {
          return null
        }

        const cardData = mapUserToCardData({
          user: author,
          skills: authorSkills,
          subcategoriesById,
        })

        const skillId = cardData.teachTags[0]?.id

        if (!skillId) {
          return null
        }

        const skill = skills.find((item) => item.id === skillId)

        return {
          skillId,
          user: cardData,
          isLiked: likedState[skillId] ?? false,
          likeCount: likeCounts[skillId] ?? skill?.likeCount ?? 0,
        }
      })
      .filter((offer): offer is NonNullable<typeof offer> => offer !== null)
  }, [category?.id, skills, users, userId, subcategoriesById, likedState, likeCounts])

  const galleryImages = useMemo(
    () => toGalleryImages(skill?.imageUrl, { idPrefix: skill?.id, altPrefix: skill?.title }),
    [skill?.id, skill?.imageUrl, skill?.title],
  )

  const handleRequest = () => {
    if (!skill?.id || !userId) return

    // неавторизованному пользователю предлагаем зарегистрироваться
    if (!isAuthenticated || !currentUser) {
      setIsAuthModalOpen(true)
      return
    }

    // защита от повторной заявки
    if (isRequested) return

    dispatch(
      createRequest({
        skillId: skill.id,
        skillTitle: skill.title,
        fromUserId: currentUser.id,
        toUserId: userId,
      }),
    )

    setIsOpenModal(true)
  }

  if (isLoading || !skill || !subcategory || !category) {
    return (
      <main className={Styles.Main}>
        <p>Загрузка данных...</p>
      </main>
    )
  }

  if (isLoadingUser) {
    return <div>Загрузка пользователя...</div>
  }

  if (!selectedUser || selectedUser.id !== userId) {
    return <div>Пользователь не найден</div>
  }

  const user = mapUserToCardData({
    user: selectedUser,
    skills: userSkills,
    subcategoriesById,
  })

  const ModalActionButton = ({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick: () => void
  }) => (
    <div className={Styles.ModalActions}>
      <Button className={Styles.ModalButton} type="button" onClick={onClick}>
        {children}
      </Button>
    </div>
  )

  return (
    <main className={Styles.Main}>
      {isOpenModal && (
        <ModalUI
          title={'Вы предложили обмен'}
          description={'Теперь дождитесь подтверждения. Вам придёт уведомление'}
          icon={<NotificationIcon size={100} />}
          onClose={() => setIsOpenModal(false)}
          className={Styles.compactModal}
        >
          <ModalActionButton onClick={() => setIsOpenModal(false)}>Готово</ModalActionButton>
        </ModalUI>
      )}
      {isAuthModalOpen && (
        <ModalUI
          title="Хотите предложить обмен?"
          description="Зарегистрируйтесь, чтобы предлагать обмен навыками"
          onClose={() => setIsAuthModalOpen(false)}
          className={Styles.compactModal}
        >
          <ModalActionButton
            onClick={() =>
              navigate(ROUTES.REGISTER, {
                state: {
                  from: location,
                  openModal: 'auth',
                  skillId: skill?.id,
                  authorId: userId,
                },
              })
            }
          >
            Зарегистрироваться
          </ModalActionButton>
        </ModalUI>
      )}
      {isRegistrationModalOpen && (
        <ModalUI
          title="Хотите поставить лайк?"
          description="Зарегистрируйтесь, чтобы добавлять навыки в избранное"
          onClose={closeRegistrationModal}
          className={Styles.compactModal}
        >
          <ModalActionButton
            onClick={() =>
              navigate(ROUTES.REGISTER, {
                state: { from: location, openModal: 'registration' },
              })
            }
          >
            Зарегистрироваться
          </ModalActionButton>
        </ModalUI>
      )}
      <div className={Styles.Skill}>
        <UserCard user={user} variant={'expanded'} />
        <UserSkillWidget
          like={{
            count: likeCounts[skill.id] ?? skill.likeCount,
            isLiked: likedState[skill.id] ?? false,
            onClick: () => handleLike(skill.id),
          }}
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
              disabled={isRequested}
              onClick={handleRequest}
            >
              <span>{isRequested ? 'Обмен предложен' : 'Предложить обмен'}</span>
            </Button>
          }
        />
      </div>
      <div className={Styles.SimilarVariants}>
        <SimilarOffers
          cards={similarOffers}
          onDetailsClick={(skillId) => navigate(generatePath(ROUTES.SKILL, { id: skillId }))}
          onLikeChange={(skillId) => {
            handleLike(skillId)
          }}
        ></SimilarOffers>
      </div>
    </main>
  )
}
