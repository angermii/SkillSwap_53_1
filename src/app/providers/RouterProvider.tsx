import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useEffect, useState, useRef, useMemo, lazy, Suspense } from 'react'
import { ROUTES } from '@/shared/lib/constants'
import { Header } from '@/widgets'
import { PrivateRoute } from '@/features/auth/ui/PrivateRoute'
import { fetchSkillCategories, fetchSkillSubcategories } from '@/entities/skill/model/skillSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { mapCategoriesToSections } from '@/shared/lib/categorySectionsMapper'

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
  const dispatch = useAppDispatch()
  const taxonomyRequestedRef = useRef(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { categories, subcategories, loading } = useAppSelector((state) => state.skill)

  const categorySections = useMemo(
    () => mapCategoriesToSections(categories, subcategories),
    [categories, subcategories],
  )

  useEffect(() => {
    if (taxonomyRequestedRef.current) {
      return
    }

    taxonomyRequestedRef.current = true

    if (categories.length === 0 && !loading.categories) {
      void dispatch(fetchSkillCategories())
    }

    if (subcategories.length === 0 && !loading.subcategories) {
      void dispatch(fetchSkillSubcategories())
    }
  }, [dispatch, categories.length, subcategories.length, loading.categories, loading.subcategories])

  return (
    <>
      <Header
        variant="loggedOut"
        categorySections={categorySections}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {/* далее исправим на  <Header variant={isAuthenticated ? 'loggedIn' : 'loggedOut'} />  */}
      <Outlet context={{ searchQuery }} />
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
