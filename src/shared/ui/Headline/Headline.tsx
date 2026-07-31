import clsx from 'clsx'
import styles from './Headline.module.css'
import type { HeadlineProps } from './type'

export const Headline = ({
  title,
  as: Heading = 'h2',
  action,
  children,
  className,
  titleClassName,
  actionClassName,
  ...props
}: HeadlineProps) => {
  const extra = action ?? children

  return (
    <div {...props} className={clsx(styles.headline, className)}>
      <Heading className={clsx(styles.title, titleClassName)}>{title}</Heading>

      {extra ? <div className={clsx(styles.action, actionClassName)}>{extra}</div> : null}
    </div>
  )
}
