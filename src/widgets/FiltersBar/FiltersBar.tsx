import { useState } from 'react'
import {
  CloseIcon,
  Button,
  ModalUI,
  SkillCategory,
  FiltersContentProps,
  FiltersContent,
} from '@/shared/ui'
import styles from './FiltersBar.module.css'

// =========================================================================
// 1. Данные и тип
// =========================================================================

export const FULL_SKILLS_DATA: SkillCategory[] = [
  {
    name: 'Бизнес и карьера',
    subcategories: ['Менеджмент', 'Маркетинг', 'Финансы', 'Стартапы'],
  },
  {
    name: 'Творчество и искусство',
    subcategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актёрское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
  },
  {
    name: 'Иностранные языки',
    subcategories: ['Английский', 'Испанский', 'Французский', 'Немецкий', 'Китайский'],
  },
  {
    name: 'Образование и развитие',
    subcategories: ['Педагогика', 'Психология', 'Скорочтение'],
  },
  {
    name: 'Здоровье и лайфстайл',
    subcategories: ['Фитнес', 'Йога', 'Нутрициология'],
  },
  {
    name: 'Дом и уют',
    subcategories: ['Дизайн интерьера', 'Кулинария', 'Уборка'],
  },
]

export const FULL_CITIES_DATA = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
]

// =========================================================================
// 2. Сам компонент
// =========================================================================
type FiltersBarProps = FiltersContentProps & {
  onReset: () => void
}

export const FiltersBar = ({
  skillsData,
  cities,
  exchangeType,
  authorGender,
  selectedCategories = [],
  selectedSubcategories,
  selectedCities,
  onExchangeTypeChange,
  onGenderChange,
  onCategoriesChange,
  onSubcategoriesChange,
  onCitiesChange,
  onReset,
}: FiltersBarProps) => {
  // Локальные состояния только для визуала (открыто/закрыто)

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const activeFiltersCount =
    (exchangeType !== 'all' ? 1 : 0) +
    (authorGender !== 'any' ? 1 : 0) +
    selectedCategories.length +
    selectedSubcategories.length +
    selectedCities.length

  return (
    <>
      {/* desktop */}
      <aside className={styles.sidebar}>
        {/* --- Шапка --- */}
        <div className={styles.header}>
          <h2 className={styles.mainTitle}>
            Фильтры{' '}
            {activeFiltersCount > 0 && <span className={styles.count}>({activeFiltersCount})</span>}
          </h2>
          {activeFiltersCount > 0 && (
            <button className={styles.resetButton} onClick={onReset}>
              Сбросить <CloseIcon size={16} />
            </button>
          )}
        </div>
        <FiltersContent
          skillsData={skillsData}
          cities={cities}
          exchangeType={exchangeType}
          authorGender={authorGender}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          selectedCities={selectedCities}
          onExchangeTypeChange={onExchangeTypeChange}
          onGenderChange={onGenderChange}
          onCategoriesChange={onCategoriesChange}
          onSubcategoriesChange={onSubcategoriesChange}
          onCitiesChange={onCitiesChange}
        />
      </aside>

      {/* Mobile filters */}
      <div className={styles.mobileFilters}>
        <div className={styles.mobileFiltersHeader}>
          <Button variant="secondary" onClick={() => setIsMobileFiltersOpen(true)}>
            Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>{' '}
          {activeFiltersCount > 0 && (
            <button
              className={styles.resetButton}
              onClick={() => {
                onReset()
                setIsMobileFiltersOpen(false)
              }}
            >
              Сбросить <CloseIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {isMobileFiltersOpen && (
        <ModalUI
          title="Фильтры"
          onClose={() => setIsMobileFiltersOpen(false)}
          className={styles.modalFilters}
        >
          <div className={styles.modalFiltersContent}>
            <FiltersContent
              skillsData={skillsData}
              cities={cities}
              exchangeType={exchangeType}
              authorGender={authorGender}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              selectedCities={selectedCities}
              onExchangeTypeChange={onExchangeTypeChange}
              onGenderChange={onGenderChange}
              onCategoriesChange={onCategoriesChange}
              onSubcategoriesChange={onSubcategoriesChange}
              onCitiesChange={onCitiesChange}
            />
            <Button onClick={() => setIsMobileFiltersOpen(false)}> Применить </Button>
          </div>
        </ModalUI>
      )}
    </>
  )
}
