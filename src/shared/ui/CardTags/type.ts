export type SkillCategory = 'business' | 'art' | 'languages' | 'education' | 'home' | 'health' | 'plus'

export type SkillTag = {
  id: string
  title: string
  category: SkillCategory
  subcategory: string
}

export type CardTagsProps = {
  /** Навыки в блоке "Может научить" */
  teachTags: SkillTag[]
  /** Навыки в блоке "Хочет научиться" */
  learnTags: SkillTag[]
  /** Заголовок блока "Может научить" (по умолчанию — с двоеточием, для маленькой карточки) */
  teachHeading?: string
  /** Заголовок блока "Хочет научиться" (по умолчанию — с двоеточием, для маленькой карточки) */
  learnHeading?: string
  /** Отступ между блоками teach и learn, в пикселях */
  gap?: number
  className?: string
}