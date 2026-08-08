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
import { useEffect, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export const MainLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // проверяем залогинен ли юзер и вытаскиваем его
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const user = useAppSelector((state) => state.auth.user)

  //выход
  const handleLogout = () => {
    dispatch(logout())
  }

  // Данные из стора
  const categories = useAppSelector(selectSkillCategories)
  const subcategories = useAppSelector(selectSkillSubcategories)
  const categoriesLoading = useAppSelector(selectSkillCategoriesLoading)
  const subcategoriesLoading = useAppSelector(selectSkillSubcategoriesLoading)

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
        notifications={[]}
        readAll={() => {}}
        clearAll={() => {}}
        onNotificationClick={() => {}}
        onLoginClick={() => navigate(ROUTES.LOGIN)}
        onRegisterClick={() => navigate(ROUTES.REGISTER)}
        onThemeClick={() => {}}
        onFavoritesClick={() => navigate(ROUTES.FAVORITES)}
        onLogout={handleLogout}
      />
      <Outlet />
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
