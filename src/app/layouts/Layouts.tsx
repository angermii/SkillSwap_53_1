import {
  selectSkillCategories,
  selectSkillSubcategories,
  selectSkillCategoriesLoading,
  selectSkillSubcategoriesLoading,
} from '@/entities/skill/model/selectors'
import { fetchSkillCategories, fetchSkillSubcategories } from '@/entities/skill/model/skillSlice'
import { logout } from '@/features/auth'
import { mapCategoriesToSections } from '@/shared/lib/categorySectionsMapper'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Header } from '@/widgets'
import { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  clearReadNotifications,
  readAllNotifications,
  readNotification,
  selectNotificationRequests,
} from '@/entities/request/requestsSlice'
import { mapRequestsToNotifications } from '@/widgets/Notifications'

export const MainLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // проверяем залогинен ли юзер и вытаскиваем его
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const user = useAppSelector((state) => state.auth.user)

  // полученные предложения обмена для виджета уведомлений
  const notificationRequests = useAppSelector((state) =>
    user ? selectNotificationRequests(state, user.id) : [],
  )

  const notifications = mapRequestsToNotifications(notificationRequests)

  //выход
  const handleLogout = () => {
    dispatch(logout())
  }

  // отметить все входящие уведомления как прочитанные
  const handleReadAll = () => {
    if (user) {
      dispatch(readAllNotifications(user.id))
    }
  }

  // убрать прочитанные уведомления из виджета
  const handleClearAll = () => {
    if (user) {
      dispatch(clearReadNotifications(user.id))
    }
  }

  // отметить выбранное уведомление как прочитанное
  const handleNotificationClick = (requestId: string) => {
    dispatch(readNotification(requestId))
  }

  // Данные из стора
  const categories = useAppSelector(selectSkillCategories)
  const subcategories = useAppSelector(selectSkillSubcategories)
  const categoriesLoading = useAppSelector(selectSkillCategoriesLoading)
  const subcategoriesLoading = useAppSelector(selectSkillSubcategoriesLoading)

  // Поиск
  const [searchQuery, setSearchQuery] = useState('')

  // Загружаем категории для меню Header при инициализации приложения
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchSkillCategories())
    }
    if (subcategories.length === 0 && !subcategoriesLoading) {
      dispatch(fetchSkillSubcategories())
    }
  }, [dispatch, categories.length, subcategories.length, categoriesLoading, subcategoriesLoading])

  // Преобразуем в формат для CategoryMenu
  const categorySections = useMemo(
    () => mapCategoriesToSections(categories, subcategories),
    [categories, subcategories],
  )

  return (
    <>
      <Header
        variant={isAuthenticated ? 'loggedIn' : 'loggedOut'}
        user={user ?? undefined}
        categorySections={categorySections}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        readAll={handleReadAll}
        clearAll={handleClearAll}
        onNotificationClick={handleNotificationClick}
        onLoginClick={() => navigate(ROUTES.LOGIN)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
        onThemeClick={() => {}}
        onFavoritesClick={() => navigate(ROUTES.FAVORITES)}
        onLogout={handleLogout}
      />
      <Outlet  context={{ searchQuery }}/>
    </>
  )
}

export const PureLayout = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(ROUTES.HOME)
    }
  }

  return (
    <>
      <Header variant="pure" onCloseClick={handleClose} />
      <Outlet />
    </>
  )
}
