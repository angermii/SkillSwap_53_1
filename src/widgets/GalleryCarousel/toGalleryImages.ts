import type { GalleryImage } from './type'

type ToGalleryImagesOptions = {
  // префикс для стабильных ключей слайдов, обычно id навыка
  idPrefix?: string
  // подпись изображения, обычно название навыка
  altPrefix?: string
}

// приводим сырые ссылки из стора к формату, который ожидает GalleryCarousel
export const toGalleryImages = (
  imageUrls: string[] | null | undefined,
  { idPrefix = 'image', altPrefix }: ToGalleryImagesOptions = {},
): GalleryImage[] =>
  (imageUrls ?? [])
    .filter((src): src is string => typeof src === 'string' && src.trim().length > 0)
    .map((src, index) => ({
      id: `${idPrefix}-${index}`,
      src,
      alt: altPrefix ? `${altPrefix} — изображение ${index + 1}` : `Изображение ${index + 1}`,
    }))
