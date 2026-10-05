import type { Skill, SkillSubcategory, User } from '@/shared/types'

import type { UserCardData } from './type'

type CardTag = UserCardData['teachTags'][number]

type MapUserToCardDataParams = {
  user: User
  skills: Skill[]
  subcategoriesById: ReadonlyMap<string, SkillSubcategory>
}

const TAG_CATEGORIES = [
  'business',
  'art',
  'languages',
  'education',
  'home',
  'health',
  'plus',
] as const satisfies readonly CardTag['category'][]

const isTagCategory = (categoryId: string): categoryId is CardTag['category'] =>
  TAG_CATEGORIES.some((category) => category === categoryId)

const toTagCategory = (categoryId?: string): CardTag['category'] =>
  categoryId && isTagCategory(categoryId) ? categoryId : 'plus'

export const groupSkillsByAuthor = (skills: Skill[]): Map<string, Skill[]> => {
  const skillsByAuthor = new Map<string, Skill[]>()

  skills.forEach((skill) => {
    const authorSkills = skillsByAuthor.get(skill.authorId)

    if (authorSkills) {
      authorSkills.push(skill)
    } else {
      skillsByAuthor.set(skill.authorId, [skill])
    }
  })

  return skillsByAuthor
}

/**
 * Собирает данные пользователя, его навыки и подкатегории
 * в формат, необходимый компоненту UserCard
 */
export const mapUserToCardData = ({
  user,
  skills,
  subcategoriesById,
}: MapUserToCardDataParams): UserCardData => {
  const mapSkillToTag = (skill: Skill): CardTag => {
    const subcategory = subcategoriesById.get(skill.subcategoryId)

    return {
      id: skill.id,
      title: skill.title,
      category: toTagCategory(subcategory?.categoryId),
      subcategory: subcategory?.title ?? skill.subcategoryId,
    }
  }

  return {
    id: user.id,
    name: user.name,
    city: user.city,
    age: user.age,
    avatarUrl: user.avatarUrl,
    description: user.description,
    teachTags: skills.filter((skill) => skill.type === 'teach').map(mapSkillToTag),
    learnTags: skills.filter((skill) => skill.type === 'learn').map(mapSkillToTag),
  }
}
