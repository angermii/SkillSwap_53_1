import { Avatar } from '@/shared/ui'
import { IconButton } from '@/shared/ui'
import { GalleryEditIcon } from '@/shared/ui/icons'
import styles from './userPhoto.module.css'

export type UserPhotoProps = {
  alt: string
  src: string
  onClick: () => void
}
// Компонент UserPhoto - использует аватар и кнопку IconButton для редактирования
export const UserPhoto = ({ alt, src, onClick }: UserPhotoProps) => {
  return (
    <div className={styles.wrapper}>
      <Avatar alt={alt} src={src} size={244} />
      <IconButton
        icon={<GalleryEditIcon />}
        isActive={false}
        onClick={onClick}
        aria-label="загрузить новое фото"
        className={styles.editButton}
      />
    </div>
  )
}
