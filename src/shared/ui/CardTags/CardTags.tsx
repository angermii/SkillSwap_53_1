import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { Label } from '../Label'
import type { LabelColor } from '../Label/type'
import type { CardTagsProps, SkillTag } from './type'
import styles from './CardTags.module.css'

// цвет тега зависит от категории навыка
const CATEGORY_COLORS: Record<SkillTag['category'], LabelColor> = {
  business: 'purple',
  art: 'pink',
  languages: 'yellow',
  education: 'blue',
  home: 'peach',
  health: 'green',
  plus: 'gray',
}

const GAP = 4
const OVERFLOW_WIDTH = 48

type TagSectionProps = {
  heading: string
  tags: SkillTag[]
  sectionGap: number
}

function TagSection({ heading, tags, sectionGap }: TagSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const [visibleCount, setVisibleCount] = useState(tags.length)

  // считаем, сколько тегов помещается по ширине контейнера
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const calculate = () => {
      const containerWidth = container.offsetWidth
      let usedWidth = 0
      let count = 0

      for (let i = 0; i < tags.length; i += 1) {
        const item = itemRefs.current[i]
        if (!item) break

        const isLast = i === tags.length - 1
        const reserve = isLast ? 0 : OVERFLOW_WIDTH + GAP
        const nextWidth = usedWidth + item.offsetWidth + (count > 0 ? GAP : 0)

        if (nextWidth + reserve > containerWidth) break

        usedWidth = nextWidth
        count += 1
      }

      setVisibleCount(Math.max(count, 1))
    }

    calculate()

    const observer = new ResizeObserver(calculate)
    observer.observe(container)

    return () => observer.disconnect()
  }, [tags.length])

  if (tags.length === 0) return null

  const hiddenCount = tags.length - visibleCount

  return (
    <div className={styles.section} style={{ gap: sectionGap }}>
      <h4 className={styles.heading}>{heading}</h4>

      <div className={styles.tagsWrap} ref={containerRef}>
        {tags.slice(0, visibleCount).map((tag) => (
          <Label key={tag.id} text={tag.title} color={CATEGORY_COLORS[tag.category]} />
        ))}
        {hiddenCount > 0 && <Label text={`+${hiddenCount}`} color="gray" />}
      </div>

      {/* скрытые теги — только чтобы измерить их реальную ширину */}
      <div className={styles.measureWrap} aria-hidden="true">
        {tags.map((tag, index) => (
          <span
            key={tag.id}
            ref={(node) => {
              itemRefs.current[index] = node
            }}
          >
            <Label text={tag.title} color={CATEGORY_COLORS[tag.category]} />
          </span>
        ))}
      </div>
    </div>
  )
}

export const CardTags = ({
  teachTags,
  learnTags,
  teachHeading = 'Может научить:',
  learnHeading = 'Хочет научиться:',
  gap = 12,
  sectionGap = 8,
  className,
}: CardTagsProps) => {
  // отступ нужен только если рендерятся оба блока
  const showGap = teachTags.length > 0 && learnTags.length > 0

  return (
    <div className={clsx(styles.cardTags, className)}>
      <TagSection heading={teachHeading} tags={teachTags} sectionGap={sectionGap} />
      <div style={showGap ? { marginTop: gap } : undefined}>
        <TagSection heading={learnHeading} tags={learnTags} sectionGap={sectionGap} />
      </div>
    </div>
  )
}
