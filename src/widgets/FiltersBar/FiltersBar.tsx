import { useState } from 'react'
import clsx from 'clsx'
import { Checkbox, RadioButton, ChevronDownIcon, CloseIcon } from '@/shared/ui'
import styles from './FiltersBar.module.css'

// =========================================================================
// 1. Данные и тип
// =========================================================================

export interface SkillCategory {
  name: string
  subcategories: string[]
}

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

// Пропсы
export interface FiltersBarProps {
  skillsData: SkillCategory[]
  cities: string[]
  exchangeType: string
  authorGender: string
  selectedCategories?: string[] // Опционально для обратной совместимости
  selectedSubcategories: string[]
  selectedCities: string[]
  onExchangeTypeChange: (value: string) => void
  onGenderChange: (value: string) => void
  onCategoriesChange?: (categories: string[]) => void
  onSubcategoriesChange: (subcategories: string[]) => void
  onCitiesChange: (cities: string[]) => void
  onReset: () => void
}

// =========================================================================
// 2. Сам компонент
// =========================================================================

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
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [showAllCities, setShowAllCities] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Творчество и искусство'])

  const activeFiltersCount =
    (exchangeType !== 'all' ? 1 : 0) +
    (authorGender !== 'any' ? 1 : 0) +
    selectedCategories.length +
    selectedSubcategories.length +
    selectedCities.length

  // --- Хэндлер для клика по главной категории (чекбоксу) ---
  const toggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      // 1. Убираем галочку с самой категории
      onCategoriesChange?.(selectedCategories.filter((c) => c !== categoryName))

      // 2. Ищем все подкатегории внутри этой категории
      const categoryData = skillsData.find((c) => c.name === categoryName)
      if (categoryData) {
        const subsToRemove = categoryData.subcategories

        // 3. Сбрасываем выбранные подкатегории, которые к ней относятся
        onSubcategoriesChange(selectedSubcategories.filter((sub) => !subsToRemove.includes(sub)))
      }
    } else {
      // Включаем категорию
      onCategoriesChange?.([...selectedCategories, categoryName])
    }
  }

  // --- Хэндлеры для подкатегорий и городов ---
  const toggleSubcategory = (sub: string) => {
    if (selectedSubcategories.includes(sub)) {
      onSubcategoriesChange(selectedSubcategories.filter((s) => s !== sub))
    } else {
      onSubcategoriesChange([...selectedSubcategories, sub])
    }
  }

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      onCitiesChange(selectedCities.filter((c) => c !== city))
    } else {
      onCitiesChange([...selectedCities, city])
    }
  }

  // --- Хэндлер для клика по стрелочке (шеврону) ---
  const toggleCategoryExpand = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    )
  }

  const visibleSkills = showAllSkills ? skillsData : skillsData.slice(0, 6)
  const visibleCities = showAllCities ? cities : cities.slice(0, 5)

  return (
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

      <div className={styles.sectionsWrapper}>
        {/* --- Тип обмена --- */}
        <section className={styles.section}>
          <div className={styles.list}>
            <RadioButton
              name="exchange_type"
              label="Всё"
              value="all"
              checked={exchangeType === 'all'}
              onChange={(e) => onExchangeTypeChange(e.target.value)}
            />
            <RadioButton
              name="exchange_type"
              label="Хочу научиться"
              value="learn"
              checked={exchangeType === 'learn'}
              onChange={(e) => onExchangeTypeChange(e.target.value)}
            />
            <RadioButton
              name="exchange_type"
              label="Могу научить"
              value="teach"
              checked={exchangeType === 'teach'}
              onChange={(e) => onExchangeTypeChange(e.target.value)}
            />
          </div>
        </section>

        {/* --- Навыки --- */}
        <section className={styles.section}>
          <h3 className={styles.subtitle}>Навыки</h3>
          <div className={styles.list}>
            {visibleSkills.map((category) => {
              const isExpanded = expandedCategories.includes(category.name)

              return (
                <div key={category.name} className={styles.categoryBlock}>
                  <div className={styles.categoryHeader}>
                    {/* Клик по чекбоксу переключает фильтр */}
                    <Checkbox
                      label={category.name}
                      variant="category"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => toggleCategory(category.name)}
                    />
                    {/* Клик по кнопке раскрывает список */}
                    <button
                      type="button"
                      className={styles.chevronBtn}
                      onClick={() => toggleCategoryExpand(category.name)}
                    >
                      <ChevronDownIcon
                        className={clsx(styles.chevron, isExpanded && styles.chevronUp)}
                      />
                    </button>
                  </div>

                  {/* Плавная анимация раскрытия через CSS Grid */}
                  <div
                    className={clsx(styles.subListWrapper, isExpanded && styles.subListExpanded)}
                  >
                    <div className={styles.subList}>
                      {category.subcategories.map((sub) => (
                        <Checkbox
                          key={sub}
                          label={sub}
                          variant="subcategory"
                          checked={selectedSubcategories.includes(sub)}
                          onChange={() => toggleSubcategory(sub)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {skillsData.length > 6 && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowAllSkills(!showAllSkills)}
            >
              {showAllSkills ? 'Скрыть' : 'Все категории'}
              <ChevronDownIcon
                className={clsx(styles.chevron, showAllSkills && styles.chevronUp)}
              />
            </button>
          )}
        </section>

        {/* --- Пол автора --- */}
        <section className={styles.section}>
          <h3 className={styles.subtitle}>Пол автора</h3>
          <div className={styles.list}>
            <RadioButton
              name="author_gender"
              label="Не имеет значения"
              value="any"
              checked={authorGender === 'any'}
              onChange={(e) => onGenderChange(e.target.value)}
            />
            <RadioButton
              name="author_gender"
              label="Мужской"
              value="male"
              checked={authorGender === 'male'}
              onChange={(e) => onGenderChange(e.target.value)}
            />
            <RadioButton
              name="author_gender"
              label="Женский"
              value="female"
              checked={authorGender === 'female'}
              onChange={(e) => onGenderChange(e.target.value)}
            />
          </div>
        </section>

        {/* --- Город --- */}
        <section className={styles.section}>
          <h3 className={styles.subtitle}>Город</h3>
          <div className={styles.list}>
            {visibleCities.map((city) => (
              <Checkbox
                key={city}
                label={city}
                variant="subcategory"
                checked={selectedCities.includes(city)}
                onChange={() => toggleCity(city)}
              />
            ))}
          </div>
          {cities.length > 5 && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowAllCities(!showAllCities)}
            >
              {showAllCities ? 'Скрыть' : 'Все города'}
              <ChevronDownIcon
                className={clsx(styles.chevron, showAllCities && styles.chevronUp)}
              />
            </button>
          )}
        </section>
      </div>
    </aside>
  )
}
