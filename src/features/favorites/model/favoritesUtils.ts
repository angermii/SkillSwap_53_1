import { LOCAL_STORAGE_KEYS } from "@/shared/lib/constants";

export function getFavorites(): string[] {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);

        return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
        return []
    }
};

export function saveFavorites(favorites: string[]): void {
    localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites),
    )
};

export function clearFavorites(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.FAVORITES);
};