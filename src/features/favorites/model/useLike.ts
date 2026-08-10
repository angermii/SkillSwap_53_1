import { useEffect, useMemo, useState } from 'react'
import type { Skill } from '@/entities/skill/model/types'
import { toggleFavorite } from './favoritesSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type UseLikeParams = {
  skills: Skill[]
}

export const useLike = ({ skills }: UseLikeParams) => {
  const dispatch = useAppDispatch()

  // Проверяем авторизацию перед изменением лайка
  // Неавторизованному пользователю вместо лайка показываем модалку регистрации
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  // Состояние лайка уже хранится в favoritesSlice, поэтому не дублируем isLiked в локальном state
  const favoriteIds = useAppSelector((state) => state.favorites.ids)

  // Преобразуем массив ID в объект для быстрого определения состояния лайка навыка по ID
  const likedState = useMemo(() => {
    const result: Record<string | number, boolean> = {}

    favoriteIds.forEach((skillId) => {
      result[skillId] = true
    })

    return result
  }, [favoriteIds])

  // Храним текущие значения счётчиков лайков для навыков
  const [likeCounts, setLikeCounts] = useState<Record<string | number, number>>({})

  // Обновляем счётчики после загрузки навыков
  // Если для навыка уже есть значение в sessionStorage, используем его
  //  Иначе берём исходный likeCount из данных навыка
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

  // Обрабатываем изменение лайка конкретного навыка
  // LikeButton рассчитывает новый count
  // Для авторизованного пользователя применяем изменение, для неавторизованного показываем модалку регистрации
  const handleLike = (skillId: string | number, newCount: number) => {
    if (!isAuthenticated) {
      setIsRegistrationModalOpen(true)
      return
    }

    // Обновляем счётчик только для конкретного навыка
    setLikeCounts((prev) => ({
      ...prev,
      [skillId]: newCount,
    }))

    // Сохраняем счётчик в текущей браузерной сессии
    sessionStorage.setItem(`skill-like-count-${skillId}`, String(newCount))

    // favoritesSlice добавляет навык в список или удаляет его из списка.
    dispatch(toggleFavorite(String(skillId)))
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
