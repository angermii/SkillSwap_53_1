import { useState } from 'react';
import clsx from 'clsx';
import { Checkbox, RadioButton, ChevronDownIcon, CloseIcon } from '@/shared/ui';
import styles from './FiltersBar.module.css';



//это для проверки, обычно вставляю вот в этот файл src/pages/CatalogPage/index.tsx 


//
//import { FiltersBar } from '@/widgets';
//
//export default function CatalogPage() {
  //return (
    //<main style={{ padding: '40px', backgroundColor: '#F9FAF7', minHeight: '100vh', display: 'flex', gap: '20px' }}>
//
    //  {/* Выводим наш новый виджет */}
     // <FiltersBar />

     // {/* Здесь в будущем будет сетка с карточками навыков */}
     // <div>Тут будут карточки...</div>

   // </main>
 // );
//}
 //





// Расширенные моковые данные с иерархией поднавыков
const SKILLS_DATA = [
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
    subcategories: ['Английский', 'Испанский', 'Китайский', 'Немецкий'],
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
];

const CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
];

export const FiltersBar = () => {
  // --- Состояния ---
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Творчество и искусство']);

  const [exchangeType, setExchangeType] = useState('all');
  const [authorGender, setAuthorGender] = useState('any');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Подсчет активных фильтров (по макету)
  const activeFiltersCount = 
    (exchangeType !== 'all' ? 1 : 0) + 
    (authorGender !== 'any' ? 1 : 0) + 
    selectedSubcategories.length + 
    selectedCities.length;

  // --- Хэндлеры ---
  const resetFilters = () => {
    setExchangeType('all');
    setAuthorGender('any');
    setSelectedSubcategories([]);
    setSelectedCities([]);
  };

  const toggleArrayItem = (
    item: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Хэндлер раскрытия/скрытия подсписка
  const toggleCategoryExpand = (categoryName: string) => {
    toggleArrayItem(categoryName, setExpandedCategories);
  };

  const visibleSkills = showAllSkills ? SKILLS_DATA : SKILLS_DATA.slice(0, 6);
  const visibleCities = showAllCities ? CITIES : CITIES.slice(0, 5);

  return (
    <aside className={styles.sidebar}>
      {/* --- Шапка с кнопкой сброса --- */}
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>
          Фильтры {activeFiltersCount > 0 && <span className={styles.count}>({activeFiltersCount})</span>}
        </h2>
        {activeFiltersCount > 0 && (
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить <CloseIcon size={16} />
          </button>
        )}
      </div>

      {/* --- Тип обмена --- */}
      <section className={styles.section}>
        <div className={styles.list}>
          <RadioButton
            name="exchange_type"
            label="Всё"
            value="all"
            checked={exchangeType === 'all'}
            onChange={(e) => setExchangeType(e.target.value)}
          />
          <RadioButton
            name="exchange_type"
            label="Хочу научиться"
            value="learn"
            checked={exchangeType === 'learn'}
            onChange={(e) => setExchangeType(e.target.value)}
          />
          <RadioButton
            name="exchange_type"
            label="Могу научить"
            value="teach"
            checked={exchangeType === 'teach'}
            onChange={(e) => setExchangeType(e.target.value)}
          />
        </div>
      </section>

      {/* --- Навыки (Аккордеон) --- */}
      <section className={styles.section}>
        <h3 className={styles.subtitle}>Навыки</h3>
        <div className={styles.list}>
          {visibleSkills.map((category) => {
            const isExpanded = expandedCategories.includes(category.name);
            // Считаем категорию отмеченной (появится минус), если выбран хотя бы один её поднавык
            const hasSelectedSubs = category.subcategories.some(sub => selectedSubcategories.includes(sub));

            return (
              <div key={category.name} className={styles.categoryBlock}>
                <div className={styles.categoryHeader}>
                  {/* Клик по главной категории теперь ПРОСТО РАСКРЫВАЕТ СПИСОК */}
                  <Checkbox
                    label={category.name}
                    variant="category"
                    checked={hasSelectedSubs}
                    onChange={() => toggleCategoryExpand(category.name)}
                  />
                  <button 
                    type="button"
                    className={styles.chevronBtn} 
                    onClick={() => toggleCategoryExpand(category.name)}
                  >
                    <ChevronDownIcon className={clsx(styles.chevron, isExpanded && styles.chevronUp)} />
                  </button>
                </div>
                
                {/* Подкатегории */}
                {isExpanded && (
                  <div className={styles.subList}>
                    {category.subcategories.map(sub => (
                      <Checkbox
                        key={sub}
                        label={sub}
                        variant="subcategory"
                        checked={selectedSubcategories.includes(sub)}
                        onChange={() => toggleArrayItem(sub, setSelectedSubcategories)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {SKILLS_DATA.length > 6 && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowAllSkills(!showAllSkills)}
          >
            {showAllSkills ? 'Скрыть' : 'Все категории'}
            <ChevronDownIcon className={clsx(styles.chevron, showAllSkills && styles.chevronUp)} />
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
            onChange={(e) => setAuthorGender(e.target.value)}
          />
          <RadioButton
            name="author_gender"
            label="Мужской"
            value="male"
            checked={authorGender === 'male'}
            onChange={(e) => setAuthorGender(e.target.value)}
          />
          <RadioButton
            name="author_gender"
            label="Женский"
            value="female"
            checked={authorGender === 'female'}
            onChange={(e) => setAuthorGender(e.target.value)}
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
              onChange={() => toggleArrayItem(city, setSelectedCities)}
            />
          ))}
        </div>
        {CITIES.length > 5 && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowAllCities(!showAllCities)}
          >
            {showAllCities ? 'Скрыть' : 'Все города'}
            <ChevronDownIcon className={clsx(styles.chevron, showAllCities && styles.chevronUp)} />
          </button>
        )}
      </section>
    </aside>
  );
};