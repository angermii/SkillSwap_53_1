import type { Skill, SkillSubcategory, User } from '@/shared/types'
import type { CardTagsProps } from '@/shared/ui'
import type { UserCardData } from '@/widgets'

// тип тега не экспортируется из бочки shared/ui, поэтому выводим его из пропсов CardTags
type SkillTag = CardTagsProps['teachTags'][number]

export type FavoriteCard = {
  // id навыка, который лежит в избранном
  skillId: string
  user: UserCardData
  likeCount: number
}

type BuildFavoriteCardsParams = {
  favoriteIds: string[]
  skills: Skill[]
  users: User[]
  subcategories: SkillSubcategory[]
}

// id категорий из моков совпадают с цветовыми категориями тегов
const TAG_CATEGORIES = new Set<string>([
  'business',
  'art',
  'languages',
  'education',
  'home',
  'health',
])

const toTagCategory = (categoryId?: string): SkillTag['category'] =>
  categoryId && TAG_CATEGORIES.has(categoryId) ? (categoryId as SkillTag['category']) : 'plus'

/*
 * Собирает карточки избранного: для каждого лайкнутого навыка находим автора
 * Показываем все его навыки в виде тегов «может научить» / «хочет научиться».
 */
export function FavoriteCards({
  favoriteIds,
  skills,
  users,
  subcategories,
}: BuildFavoriteCardsParams): FavoriteCard[] {
  const usersById = new Map(users.map((user) => [user.id, user]))
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]))
  const subcategoriesById = new Map(subcategories.map((item) => [item.id, item]))

  // группируем навыки по автору, чтобы не фильтровать массив в цикле
  const skillsByAuthor = new Map<string, Skill[]>()
  skills.forEach((skill) => {
    const authorSkills = skillsByAuthor.get(skill.authorId)
    if (authorSkills) {
      authorSkills.push(skill)
    } else {
      skillsByAuthor.set(skill.authorId, [skill])
    }
  })

  const toTag = (skill: Skill): SkillTag => {
    const subcategory = subcategoriesById.get(skill.subcategoryId)

    return {
      id: skill.id,
      title: subcategory?.title ?? skill.title,
      category: toTagCategory(subcategory?.categoryId),
      subcategory: subcategory?.title ?? '',
    }
  }

  return favoriteIds.reduce<FavoriteCard[]>((cards, skillId) => {
    const skill = skillsById.get(skillId)
    if (!skill) return cards

    const author = usersById.get(skill.authorId)
    if (!author) return cards

    const authorSkills = skillsByAuthor.get(author.id) ?? []

    cards.push({
      skillId: skill.id,
      likeCount: skill.likeCount,
      user: {
        id: author.id,
        name: author.name,
        city: author.city,
        age: author.age,
        avatarUrl: author.avatarUrl,
        description: author.description,
        teachTags: authorSkills.filter((item) => item.type === 'teach').map(toTag),
        learnTags: authorSkills.filter((item) => item.type === 'learn').map(toTag),
      },
    })

    return cards
  }, [])
}
