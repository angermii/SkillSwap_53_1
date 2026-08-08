import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { Header } from '@/widgets'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'
import {
  fetchSkillCategories,
  fetchSkillSubcategories,
} from '@/api/skills'
import { mapCategoriesToSections } from '@/shared/lib/categorySectionsMapper'
import type { CategorySectionProps } from '@/shared/ui'

// Lazy-загрузка страниц — каждая страница грузится только при переходе на неё
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const SkillPage = lazy(() => import('@/pages/SkillPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const CreateSkillPage = lazy(() => import('@/pages/CreateSkillPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const MainLayout = () => {
  // const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [categorySections, setCategorySections] = useState<CategorySectionProps[]>([])
// Загружаем категории для меню Header при инициализации приложения
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [categories, subCategories] = await Promise.all([
          fetchSkillCategories(),
          fetchSkillSubcategories(),
        ])

        setCategorySections(
          mapCategoriesToSections(categories, subCategories),
        )
      } catch (error) {
        console.error('Failed to load categories', error)
      }
    }

    loadCategories()
  }, [])

  return (
    <>
      <Header
        variant="loggedOut"
        categorySections={categorySections}
      />
       {/* далее исправим на  <Header variant={isAuthenticated ? 'loggedIn' : 'loggedOut'} />  */}
      <Outlet />
    </>
  )
}


const PureLayout = () => (
  <>
    <Header variant="pure" />
    <Outlet />
  </>
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Загрузка...</div>}>
        <Routes>
          {/* обычные страницы */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<CatalogPage />} />
            <Route path={ROUTES.SKILL} element={<SkillPage />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />

            <Route path="*" element={<NotFoundPage />} />

            {/* Защищённые маршруты — добавь PrivateRoute обёртку */}
            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              <Route path={ROUTES.CREATE} element={<CreateSkillPage />} />
            </Route>
          </Route>

          {/* pure header */}
          <Route element={<PureLayout />}>
            <Route element={<PrivateRoute onlyUnAuth />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<LoginPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
