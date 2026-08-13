import { describe, expect, it } from 'vitest'

import { toGalleryImages } from './toGalleryImages'

describe('toGalleryImages', () => {
  it('возвращает пустой массив для null', () => {
    expect(toGalleryImages(null)).toEqual([])
  })

  it('возвращает пустой массив для undefined', () => {
    expect(toGalleryImages(undefined)).toEqual([])
  })

  it('возвращает пустой массив для пустого списка', () => {
    expect(toGalleryImages([])).toEqual([])
  })

  it('отбрасывает пустые строки и пробелы', () => {
    expect(toGalleryImages(['', '   ', '/photo.jpg'])).toEqual([
      { id: 'image-0', src: '/photo.jpg', alt: 'Изображение 1' },
    ])
  })

  it('использует префикс по умолчанию для id', () => {
    expect(toGalleryImages(['/a.jpg', '/b.jpg']).map((image) => image.id)).toEqual([
      'image-0',
      'image-1',
    ])
  })

  it('использует переданный idPrefix', () => {
    expect(toGalleryImages(['/a.jpg'], { idPrefix: 'skill-1' })[0].id).toBe('skill-1-0')
  })

  it('подставляет altPrefix в подпись', () => {
    expect(toGalleryImages(['/a.jpg'], { altPrefix: 'TypeScript' })[0].alt).toBe(
      'TypeScript — изображение 1',
    )
  })

  it('нумерует подписи с единицы', () => {
    expect(toGalleryImages(['/a.jpg', '/b.jpg']).map((image) => image.alt)).toEqual([
      'Изображение 1',
      'Изображение 2',
    ])
  })
})
