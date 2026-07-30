import { IconButton } from '@/shared/ui';
import { HeartIcon, HeartFilledIcon } from '@/shared/ui/icons';
import styles from './likeButton.module.css';


// Пропсы для компонента LikeButton
// count - счетчик лайков
// isLiked - текущее состояние лайка
// onClick - обработчик клика
export type LikeButtonProps = {
  count: number
  isLiked: boolean
  onClick?: (newCount: number, newIsLiked: boolean) => void
  className?: string
}
// Кнопка LikeButton меняет состояние через пропсы, по клику меняется состояние лайка и счетчик
export const LikeButton = ({ count, isLiked, onClick, className }: LikeButtonProps) => {
  const handleClick = () => {
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? count + 1 : Math.max(0, count - 1);
    onClick?.(newCount, newIsLiked);
  }

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      <IconButton
        icon={<HeartIcon />}
        activeIcon={<HeartFilledIcon />}
        isActive={isLiked}
        onClick={handleClick}
        aria-label="like button"
        // добалвен класс, чтобы передать цвет иконке лайка
        className={isLiked ? styles.liked : ''}
      />
      {count > 0 && <span className={styles.badge}>{count}</span>}
    </div>
  )
}
