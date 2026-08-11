import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Хук для бесконечной прокрутки.
 * @param items Исходный массив элементов (не мутируется)
 * @param itemsPerPage Количество элементов для одной подгрузки (по умолчанию 6)
 */
export const useInfiniteScroll = <T>(items: T[], itemsPerPage: number = 6) => {
  // Сколько элементов показываем сейчас
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  // Состояние искусственной загрузки
  const [isFetching, setIsFetching] = useState(false); 
  // Ссылка на невидимый элемент-триггер в конце списка
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Если исходный массив изменился (например, пользователь применил фильтры),
  // сбрасываем количество отображаемых карточек до начального
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [items, itemsPerPage]);

  // Нарезаем массив. Исходный массив не мутируется благодаря методу slice!
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  // Проверяем, остались ли еще невыведенные элементы
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const currentLoader = loaderRef.current;

    // Настраиваем Intersection Observer API для слежения за скроллом
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        
        // Если триггер появился на экране, у нас есть еще данные и сейчас ничего не грузится
        if (target.isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          
          // Имитируем запрос на сервер через setTimeout (как требуется в тикете)
          setTimeout(() => {
            setVisibleCount((prev) => prev + itemsPerPage);
            setIsFetching(false);
          }, 1000);
        }
      },
      // rootMargin: '100px' позволяет начать загрузку чуть заранее, до того как юзер упрется в самый низ
      { rootMargin: '100px', threshold: 0.1 } 
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isFetching, itemsPerPage]);

  return {
    visibleItems,
    isFetching,
    hasMore,
    loaderRef,
  };
};