export type GalleryImage = {
  id: string
  src: string
  alt?: string
}

export type GalleryCarouselProps = {
  images: GalleryImage[]
  maxThumbnails?: number
  className?: string
}
