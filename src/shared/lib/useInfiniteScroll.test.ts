import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useInfiniteScroll } from './useInfiniteScroll'

// Собираем колбэки IntersectionObserver, чтобы вручную имитировать появление триггера на экране
let observerCallbacks: IntersectionObserverCallback[] = []
const observe = vi.fn()
const unobserve = vi.fn()

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    observerCallbacks.push(callback)
  }
  observe = observe
  unobserve = unobserve
  disconnect = vi.fn()
  takeRecords = vi.fn()
  root = null
  rootMargin = ''
  thresholds = []
}

// Имитируем пересечение триггера с областью просмотра
const triggerIntersection = (isIntersecting: boolean) => {
  const callback = observerCallbacks.at(-1)

  act(() => {
    callback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
  })
}

const items = Array.from({ length: 10 }, (_, index) => `item-${index + 1}`)

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    observerCallbacks = []
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('показывает первую страницу элементов', () => {
    const { result } = renderHook(() => useInfiniteScroll(items, 3))

    expect(result.current.visibleItems).toEqual(['item-1', 'item-2', 'item-3'])
    expect(result.current.hasMore).toBe(true)
    expect(result.current.isFetching).toBe(false)
  })

  it('использует размер страницы 6 по умолчанию', () => {
    const { result } = renderHook(() => useInfiniteScroll(items))

    expect(result.current.visibleItems).toHaveLength(6)
  })

  it('не мутирует исходный массив', () => {
    const original = [...items]

    renderHook(() => useInfiniteScroll(items, 3))

    expect(items).toEqual(original)
  })

  it('hasMore равен false, когда показаны все элементы', () => {
    const { result } = renderHook(() => useInfiniteScroll(['a', 'b'], 6))

    expect(result.current.hasMore).toBe(false)
    expect(result.current.visibleItems).toEqual(['a', 'b'])
  })

  it('подгружает следующую страницу, когда триггер появился на экране', () => {
    const { result } = renderHook(() => useInfiniteScroll(items, 3))

    triggerIntersection(true)

    expect(result.current.isFetching).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.visibleItems).toHaveLength(6)
  })

  it('ничего не подгружает, пока триггер не виден', () => {
    const { result } = renderHook(() => useInfiniteScroll(items, 3))

    triggerIntersection(false)

    expect(result.current.isFetching).toBe(false)
    expect(result.current.visibleItems).toHaveLength(3)
  })

  it('не подгружает данные, когда элементы закончились', () => {
    const { result } = renderHook(() => useInfiniteScroll(['a', 'b'], 6))

    triggerIntersection(true)

    expect(result.current.isFetching).toBe(false)
    expect(result.current.visibleItems).toEqual(['a', 'b'])
  })

  it('сбрасывает счётчик при смене исходного массива', () => {
    const { result, rerender } = renderHook(
      ({ list }: { list: string[] }) => useInfiniteScroll(list, 3),
      { initialProps: { list: items } },
    )

    triggerIntersection(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.visibleItems).toHaveLength(6)

    rerender({ list: [...items].reverse() })

    expect(result.current.visibleItems).toHaveLength(3)
  })

  it('подписывается на элемент-триггер и отписывается при размонтировании', () => {
    const { result, unmount } = renderHook(() => useInfiniteScroll(items, 3))

    // По умолчанию ref пуст, поэтому подписки нет
    expect(observe).not.toHaveBeenCalled()

    act(() => {
      result.current.loaderRef.current = document.createElement('div')
    })

    // Форсируем повторный запуск эффекта через изменение зависимостей
    triggerIntersection(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(observe).toHaveBeenCalled()

    unmount()

    expect(unobserve).toHaveBeenCalled()
  })
})
