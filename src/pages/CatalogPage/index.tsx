import { useEffect, useMemo, useState } from 'react'
import { generatePath, useNavigate, useOutletContext } from 'react-router-dom'

import { fetchSkill } from '@/entities/skill/model/skillSlice'
import { fetchUsers } from '@/entities/user/model/userSlice'
import { useLike } from '@/features/favorites/model/useLike'
import { createInitialFilters, filterUsers } from '@/features/filters'
import { searchUsers } from '@/features/search'
import { sortUsers, type DateOrder, type SortType } from '@/features/sort'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { ROUTES } from '@/shared/lib/constants'
import { Button, FilterChip, ModalUI, SortIcon } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  FiltersBar,
  UserCatalog,
  groupSkillsByAuthor,
  mapUserToCardData,
  type UserCardData,
} from '@/widgets'

import styles from './CatalogPage.module.css'

type CatalogSortOption = {
  label: string
  sortType: SortType
  dateOrder?: DateOrder
}

const SORT_OPTIONS: CatalogSortOption[] = [
  {
    label: 'Сначала новые',
    sortType: 'date',
    dateOrder: 'newest',
  },
  {
    label: 'Сначала старые',
    sortType: 'date',
    dateOrder: 'oldest',
  },
  {
    label: 'По популярности',
    sortType: 'popularity',
  },
  {
    label: 'Рекомендации',
    sortType: 'recommendations',
  },
]

export default function CatalogPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [filters, setFilters] = useState(createInitialFilters)
  const [sortOptionIndex, setSortOptionIndex] = useState(0)
  const { searchQuery } = useOutletContext<{ searchQuery: string }>()

  const activeSortOption = SORT_OPTIONS[sortOptionIndex]

  const debouncedQuery = useDebounce(searchQuery, 300)

  const {
    items: users,
    loading: usersLoading,
    error: usersError,
  } = useAppSelector((state) => state.user)

  const {
    skills,
    categories,
    subcategories,
    loading: skillLoading,
    error: skillError,
  } = useAppSelector((state) => state.skill)

  // Логика лайков вынесена в useLike, чтобы её можно было использовать на других страницах
  const { likedState, likeCounts, handleLike, isRegistrationModalOpen, closeRegistrationModal } =
    useLike({ skills })

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchSkill())
  }, [dispatch])

  const skillsLoading = skillLoading.skills || skillLoading.categories || skillLoading.subcategories

  const skillsError = skillError.skills ?? skillError.categories ?? skillError.subcategories

  const isLoading = usersLoading || skillsLoading
  const error = usersError ?? skillsError

  const skillsData = useMemo(
    () =>
      categories.map((category) => ({
        name: category.title,
        subcategories: subcategories
          .filter((subcategory) => subcategory.categoryId === category.id)
          .map((subcategory) => subcategory.title),
      })),
    [categories, subcategories],
  )

  // 1. Формируем массив выбранных категорий
  const selectedCategories = useMemo(() => {
    const selectedIds = new Set(filters.categoryIds)
    return categories.filter((category) => selectedIds.has(category.id))
  }, [filters.categoryIds, categories])

  const selectedCategoryNames = useMemo(
    () => selectedCategories.map((category) => category.title),
    [selectedCategories],
  )

  // 2. Хэндлер для клика по категории в виджете
  const handleCategoriesChange = (selectedNames: string[]) => {
    const selectedNameSet = new Set(selectedNames)
    setFilters((currentFilters) => ({
      ...currentFilters,
      categoryIds: categories
        .filter((category) => selectedNameSet.has(category.title))
        .map((category) => category.id),
    }))
  }

  // 3. Хэндлер для удаления чипса категории крестиком
  const handleRemoveCategoryFilter = (categoryId: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      categoryIds: currentFilters.categoryIds.filter((id) => id !== categoryId),
    }))
  }

  const cities = useMemo(() => Array.from(new Set(users.map((user) => user.city))), [users])

  const selectedSubcategories = useMemo(() => {
    const selectedIds = new Set(filters.subcategoryIds)

    return subcategories.filter((subcategory) => selectedIds.has(subcategory.id))
  }, [filters.subcategoryIds, subcategories])

  const selectedSubcategoryNames = useMemo(
    () => selectedSubcategories.map((subcategory) => subcategory.title),
    [selectedSubcategories],
  )

  // тут порядок важен, потому что каждый следующий этап работает с результатом предыдущего
  const searchedUsers = useMemo(
    () => searchUsers(skills, debouncedQuery, users),
    [skills, debouncedQuery, users],
  )

  const filteredUsers = useMemo(
    () =>
      filterUsers({
        users: searchedUsers,
        skills,
        subcategories,
        filters,
      }),
    [searchedUsers, skills, subcategories, filters],
  )

  // TODO(FiltersBar): выбор категории целиком пока не передаётся из виджета
  // categoryIds оставлен, потому что filterUsers уже поддерживает этот сценарий
  const hasActiveFilters =
    filters.skillType !== 'all' ||
    filters.gender !== 'all' ||
    filters.categoryIds.length > 0 ||
    filters.subcategoryIds.length > 0 ||
    filters.cities.length > 0

  const isFilteredMode = debouncedQuery.trim().length > 0 || hasActiveFilters

  const sortedUsers = useMemo(
    () => sortUsers(filteredUsers, skills, activeSortOption.sortType, activeSortOption.dateOrder),
    [filteredUsers, skills, activeSortOption],
  )

  const catalogUsers = useMemo<UserCardData[]>(() => {
    const skillsByAuthorId = groupSkillsByAuthor(skills)

    const subcategoriesById = new Map(
      subcategories.map((subcategory) => [subcategory.id, subcategory]),
    )

    return sortedUsers
      .map((user) => {
        const userSkills = skillsByAuthorId.get(user.id) ?? []
        const hasTeachSkill = userSkills.some((skill) => skill.type === 'teach')

        if (!hasTeachSkill) {
          return null
        }

        return mapUserToCardData({
          user,
          skills: userSkills,
          subcategoriesById,
        })
      })
      .filter((user): user is UserCardData => user !== null)
  }, [sortedUsers, skills, subcategories])

  const catalogSections = useMemo(() => {
    const catalogUserById = new Map(catalogUsers.map((user) => [user.id, user]))

    const toCatalogUsers = (orderedUsers: typeof users) =>
      orderedUsers
        .map((user) => catalogUserById.get(user.id))
        .filter((user): user is UserCardData => user !== undefined)

    const popularUsers = toCatalogUsers(sortUsers(users, skills, 'popularity'))
    const newUsers = toCatalogUsers(sortUsers(users, skills, 'date', 'newest'))
    const recommendedUsers = toCatalogUsers(sortUsers(users, skills, 'recommendations'))

    return [
      {
        id: 'popular',
        title: 'Популярное',
        users: popularUsers,
        isExpandable: true,
      },
      {
        id: 'new',
        title: 'Новое',
        users: newUsers,
        isExpandable: true,
      },
      {
        id: 'recommendations',
        title: 'Рекомендуем',
        users: recommendedUsers,
        isExpandable: false,
      },
    ]
  }, [users, skills, catalogUsers])

  const handleExchangeTypeChange = (skillType: string) => {
    if (skillType !== 'all' && skillType !== 'learn' && skillType !== 'teach') {
      return
    }

    setFilters((currentFilters) => ({
      ...currentFilters,
      skillType,
    }))
  }

  const handleGenderChange = (gender: string) => {
    if (gender === 'any') {
      setFilters((currentFilters) => ({
        ...currentFilters,
        gender: 'all',
      }))

      return
    }

    if (gender !== 'male' && gender !== 'female') {
      return
    }

    setFilters((currentFilters) => ({
      ...currentFilters,
      gender,
    }))
  }

  const handleSubcategoriesChange = (selectedNames: string[]) => {
    const selectedNameSet = new Set(selectedNames)

    setFilters((currentFilters) => ({
      ...currentFilters,
      subcategoryIds: subcategories
        .filter((subcategory) => selectedNameSet.has(subcategory.title))
        .map((subcategory) => subcategory.id),
    }))
  }

  const handleCitiesChange = (selectedCities: string[]) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      cities: selectedCities,
    }))
  }

  const handleRemoveSkillTypeFilter = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      skillType: 'all',
    }))
  }

  const handleRemoveSubcategoryFilter = (subcategoryId: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      subcategoryIds: currentFilters.subcategoryIds.filter((id) => id !== subcategoryId),
    }))
  }

  const handleRemoveGenderFilter = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      gender: 'all',
    }))
  }

  const handleRemoveCityFilter = (city: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      cities: currentFilters.cities.filter((selectedCity) => selectedCity !== city),
    }))
  }

  const handleReset = () => {
    setFilters(createInitialFilters())
  }

  const handleSortChange = () => {
    setSortOptionIndex((currentIndex) => (currentIndex + 1) % SORT_OPTIONS.length)
  }

  const handleDetailsClick = (skillId: string | number) => {
    navigate(
      generatePath(ROUTES.SKILL, {
        id: String(skillId),
      }),
    )
  }

  return (
    <>
      <main className={styles.page}>
        <FiltersBar
          skillsData={skillsData}
          cities={cities}
          exchangeType={filters.skillType}
          authorGender={filters.gender === 'all' ? 'any' : filters.gender}
          selectedCategories={selectedCategoryNames} // <-- Добавили
          selectedSubcategories={selectedSubcategoryNames}
          selectedCities={filters.cities}
          onExchangeTypeChange={handleExchangeTypeChange}
          onGenderChange={handleGenderChange}
          onCategoriesChange={handleCategoriesChange} // <-- Добавили
          onSubcategoriesChange={handleSubcategoriesChange}
          onCitiesChange={handleCitiesChange}
          onReset={handleReset}
        />

        <div className={styles.catalog}>
          {isLoading ? (
            <div className={styles.status} role="status" aria-live="polite">
              Загрузка каталога...
            </div>
          ) : error ? (
            <div className={`${styles.status} ${styles.error}`} role="alert">
              Не удалось загрузить каталог. Попробуйте обновить страницу.
            </div>
          ) : (
            <>
              {hasActiveFilters && (
                <div className={styles.activeFilters}>
                  {filters.skillType !== 'all' && (
                    <FilterChip
                      label={filters.skillType === 'learn' ? 'Хочу научиться' : 'Могу научить'}
                      onRemove={handleRemoveSkillTypeFilter}
                    />
                  )}

                  {selectedCategories.map((category) => (
                    <FilterChip
                      key={`category-${category.id}`}
                      label={category.title}
                      onRemove={() => handleRemoveCategoryFilter(category.id)}
                    />
                  ))}

                  {selectedSubcategories.map((subcategory) => (
                    <FilterChip
                      key={`subcategory-${subcategory.id}`}
                      label={subcategory.title}
                      onRemove={() => handleRemoveSubcategoryFilter(subcategory.id)}
                    />
                  ))}

                  {filters.gender !== 'all' && (
                    <FilterChip
                      label={filters.gender === 'male' ? 'Мужской' : 'Женский'}
                      onRemove={handleRemoveGenderFilter}
                    />
                  )}

                  {filters.cities.map((city) => (
                    <FilterChip
                      key={`city-${city}`}
                      label={city}
                      onRemove={() => handleRemoveCityFilter(city)}
                    />
                  ))}
                </div>
              )}
              {users.length === 0 ? (
                <UserCatalog
                  users={[]}
                  title="Все предложения: 0"
                  onDetailsClick={handleDetailsClick}
                  onLikeChange={handleLike}
                  likedState={likedState}
                  likeCounts={likeCounts}
                />
              ) : isFilteredMode ? (
                <UserCatalog
                  users={catalogUsers}
                  title={`Подходящие предложения: ${catalogUsers.length}`}
                  action={
                    catalogUsers.length > 0 ? (
                      <Button variant="ghost" startIcon={<SortIcon />} onClick={handleSortChange}>
                        {activeSortOption.label}
                      </Button>
                    ) : undefined
                  }
                  onDetailsClick={handleDetailsClick}
                  onLikeChange={handleLike}
                  likedState={likedState}
                  likeCounts={likeCounts}
                />
              ) : (
                <UserCatalog
                  sections={catalogSections}
                  onDetailsClick={handleDetailsClick}
                  onLikeChange={handleLike}
                  likedState={likedState}
                  likeCounts={likeCounts}
                />
              )}
            </>
          )}
        </div>
      </main>

      {isRegistrationModalOpen && (
        <ModalUI
          title="Хотите поставить лайк?"
          description="Зарегистрируйтесь, чтобы добавлять навыки в избранное"
          onClose={closeRegistrationModal}
          className={styles.registrationModal}
        >
          <div className={styles.registrationButton}>
            <Button onClick={() => navigate(ROUTES.REGISTER)}>Зарегистрироваться</Button>
          </div>
        </ModalUI>
      )}
    </>
  )
}
