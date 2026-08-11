import { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  className?: string;
  intervalMs?: number; // Позволит настраивать скорость извне, если захочется
}

// Массив категорий на основе твоего дизайна
const CATEGORY_ICONS = [
  { id: 'home', icon: '🪴', label: 'Дом и уют' },
  { id: 'art', icon: '🎨', label: 'Творчество и искусство' },
  { id: 'business', icon: '💼', label: 'Бизнес и карьера' },
  { id: 'languages', icon: '🌍', label: 'Иностранные языки' },
  { id: 'education', icon: '📚', label: 'Образование и развитие' },
  { id: 'health', icon: '🧘‍♀️', label: 'Здоровье и лайфстайл' },
];

export const Spinner = ({ className, intervalMs = 600 }: SpinnerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Устанавливаем таймер, который меняет индекс категории
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CATEGORY_ICONS.length);
    }, intervalMs);

    // Обязательно очищаем таймер при размонтировании компонента!
    return () => clearInterval(timer);
  }, [intervalMs]);

  const activeCategory = CATEGORY_ICONS[currentIndex];

  return (
    <div 
      className={clsx(styles.spinnerWrapper, className)} 
      role="status" 
      aria-label={`Загрузка... ${activeCategory.label}`}
    >
      <div className={styles.iconContainer}>
        {/* Если у вас появятся свои иконки, можно будет рендерить их как компонент, 
            например: <activeCategory.icon className={styles.icon} /> */}
        <span className={styles.icon}>{activeCategory.icon}</span>
      </div>
    </div>
  );
};