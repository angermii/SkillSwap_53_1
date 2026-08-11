import { useEffect, useMemo, useState } from 'react'
import type { Skill } from '@/entities/skill/model/types'
import { toggleFavorite } from './favoritesSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type UseLikeParams = {
  skills: Skill[]
}

export const useLike = ({ skills }: UseLikeParams) => {
  const dispatch = useAppDispatch()

  // Проверяем авторизацию текущего пользователя
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  // Получаем ID текущего пользователя для привязки лайков к его аккаунту
  const userId = useAppSelector((state) => state.auth.user?.id)

  // Состояние лайка хранится в favoritesSlice
  const favoriteIds = useAppSelector((state) => state.favorites.ids)

  // Преобразуем массив ID в объект для быстрого определения состояния лайка
  const likedState = useMemo(() => {
    const result: Record<string | number, boolean> = {}

    favoriteIds.forEach((skillId) => {
      result[skillId] = true
    })

    return result
  }, [favoriteIds])

  // Храним текущие значения счётчиков лайков для навыков
  const [likeCounts, setLikeCounts] = useState<Record<string | number, number>>({})

  // После загрузки навыков восстанавливаем счётчики из текущей сессии
  // или используем исходное значение likeCount
  useEffect(() => {
    const result: Record<string | number, number> = {}

    skills.forEach((skill) => {
      const storageKey = `skill-like-count-${skill.id}`
      const savedCount = sessionStorage.getItem(storageKey)

      result[skill.id] = savedCount !== null ? Number(savedCount) : skill.likeCount
    })

    setLikeCounts(result)
  }, [skills])

  // Состояние модалки регистрации для неавторизованного пользователя
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  const handleLike = (skillId: string | number) => {
    // Если пользователь не авторизован, показываем модалку регистрации
    if (!isAuthenticated || !userId) {
      setIsRegistrationModalOpen(true)
      return
    }

    // Определяем новое состояние лайка
    const newIsLiked = !likedState[skillId]

    // Увеличиваем или уменьшаем счётчик лайков
    const newCount = newIsLiked
      ? (likeCounts[skillId] ?? 0) + 1
      : Math.max(0, (likeCounts[skillId] ?? 0) - 1)

    // Обновляем счётчик в текущем состоянии
    setLikeCounts((prev) => ({
      ...prev,
      [skillId]: newCount,
    }))

    // Сохраняем изменённый счётчик в сессии
    sessionStorage.setItem(`skill-like-count-${skillId}`, String(newCount))

    // Сохраняем лайк для конкретного пользователя
    dispatch(
      toggleFavorite({
        userId,
        skillId: String(skillId),
      }),
    )
  }

  // Закрывает модалку регистрации
  const closeRegistrationModal = () => {
    setIsRegistrationModalOpen(false)
  }

  return {
    likedState,
    likeCounts,
    handleLike,
    isRegistrationModalOpen,
    closeRegistrationModal,
  }
}
