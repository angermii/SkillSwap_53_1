import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

type FavoritesStorage = Record<string, string[]>

// Получаем избранные навыки конкретного пользователя
export function getFavorites(userId: string): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)

    if (!raw) {
      return []
    }

    const favorites = JSON.parse(raw) as FavoritesStorage

    return favorites[userId] ?? []
  } catch {
    return []
  }
}

// Сохраняем избранные навыки конкретного пользователя
export function saveFavorites(userId: string, favorites: string[]): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES)

    const allFavorites: FavoritesStorage = raw ? (JSON.parse(raw) as FavoritesStorage) : {}

    allFavorites[userId] = favorites

    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(allFavorites))
  } catch {
    // Не позволяем ошибке localStorage ломать работу приложения
  }
}

// Полностью очищаем сохранённые избранные навыки.
export function clearFavorites(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.FAVORITES)
}
