import clsx from 'clsx'

import { Label } from '../Label'
import type { LabelColor } from '../Label/type'
import type { CardTagsProps } from './type'
import styles from './CardTags.module.css'

const LABEL_COLORS: LabelColor[] = ['pink', 'blue', 'green', 'purple', 'yellow', 'peach', 'gray']

function getColor(index: number): LabelColor {
  return LABEL_COLORS[index % LABEL_COLORS.length]
}

type TagSectionProps = {
  heading: string
  tags: string[]
  maxVisibleTags: number
}

function TagSection({ heading, tags, maxVisibleTags }: TagSectionProps) {
  if (tags.length === 0) return null

  const visibleTags = tags.slice(0, maxVisibleTags)
  const hiddenCount = tags.length - visibleTags.length

  return (
    <div className={styles.section}>
      <p className={styles.heading}>{heading}</p>
      <div className={styles.tagsWrap}>
        {visibleTags.map((tag, index) => (
          <Label key={`${tag}-${index}`} text={tag} color={getColor(index)} />
        ))}
        {hiddenCount > 0 && <Label text={`+${hiddenCount}`} color="gray" />}
      </div>
    </div>
  )
}

export const CardTags = ({
  teachTags,
  learnTags,
  gap = 20,
  maxVisibleTags = 2,
  className,
}: CardTagsProps) => {
  const showGap = teachTags.length > 0 && learnTags.length > 0

  return (
    <div className={clsx(styles.cardTags, className)}>
      <TagSection heading="Может научить:" tags={teachTags} maxVisibleTags={maxVisibleTags} />
      <div style={showGap ? { marginTop: gap } : undefined}>
        <TagSection heading="Хочет научиться:" tags={learnTags} maxVisibleTags={maxVisibleTags} />
      </div>
    </div>
  )
}