import { describe, expect, it } from 'vitest'

import type { Skill, SkillSubcategory, User } from '@/shared/types'

import { groupSkillsByAuthor, mapUserToCardData } from './mapUserToCardData'

const makeSkill = (overrides: Partial<Skill> = {}): Skill => ({
  id: 'skill-1',
  title: 'TypeScript',
  description: 'Основы TypeScript',
  type: 'teach',
  subcategoryId: 'subcategory-1',
  imageUrl: null,
  authorId: 'user-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  likeCount: 0,
  ...overrides,
})

const user: User = {
  id: 'user-1',
  name: 'Иван',
  email: 'ivan@mail.ru',
  avatarUrl: null,
  gender: 'male',
  age: 30,
  city: 'Москва',
  description: 'Люблю учить',
  createdAt: '2026-01-01T00:00:00.000Z',
}

const makeSubcategoriesMap = (subcategories: SkillSubcategory[]) =>
  new Map(subcategories.map((subcategory) => [subcategory.id, subcategory]))

describe('groupSkillsByAuthor', () => {
  it('возвращает пустую Map для пустого списка', () => {
    expect(groupSkillsByAuthor([]).size).toBe(0)
  })

  it('группирует несколько навыков одного автора', () => {
    const skills = [makeSkill({ id: 'skill-1' }), makeSkill({ id: 'skill-2' })]

    expect(groupSkillsByAuthor(skills).get('user-1')).toEqual(skills)
  })

  it('разделяет навыки разных авторов', () => {
    const own = makeSkill({ id: 'skill-1', authorId: 'user-1' })
    const other = makeSkill({ id: 'skill-2', authorId: 'user-2' })

    const grouped = groupSkillsByAuthor([own, other])

    expect(grouped.get('user-1')).toEqual([own])
    expect(grouped.get('user-2')).toEqual([other])
  })
})

describe('mapUserToCardData', () => {
  const subcategoriesById = makeSubcategoriesMap([
    { id: 'subcategory-1', title: 'Программирование', categoryId: 'education' },
  ])

  it('переносит данные пользователя в формат карточки', () => {
    const result = mapUserToCardData({ user, skills: [], subcategoriesById })

    expect(result).toEqual({
      id: 'user-1',
      name: 'Иван',
      city: 'Москва',
      age: 30,
      avatarUrl: null,
      description: 'Люблю учить',
      teachTags: [],
      learnTags: [],
    })
  })

  it('раскладывает навыки по teachTags и learnTags', () => {
    const result = mapUserToCardData({
      user,
      skills: [
        makeSkill({ id: 'skill-1', type: 'teach' }),
        makeSkill({ id: 'skill-2', type: 'learn' }),
      ],
      subcategoriesById,
    })

    expect(result.teachTags.map((tag) => tag.id)).toEqual(['skill-1'])
    expect(result.learnTags.map((tag) => tag.id)).toEqual(['skill-2'])
  })

  it('подставляет категорию и название подкатегории из справочника', () => {
    const [tag] = mapUserToCardData({
      user,
      skills: [makeSkill()],
      subcategoriesById,
    }).teachTags

    expect(tag).toEqual({
      id: 'skill-1',
      title: 'TypeScript',
      category: 'education',
      subcategory: 'Программирование',
    })
  })

  it('использует «plus» и id подкатегории, если её нет в справочнике', () => {
    const [tag] = mapUserToCardData({
      user,
      skills: [makeSkill({ subcategoryId: 'unknown' })],
      subcategoriesById,
    }).teachTags

    expect(tag.category).toBe('plus')
    expect(tag.subcategory).toBe('unknown')
  })

  it('использует «plus», если категория подкатегории не входит в список тегов', () => {
    const [tag] = mapUserToCardData({
      user,
      skills: [makeSkill()],
      subcategoriesById: makeSubcategoriesMap([
        { id: 'subcategory-1', title: 'Программирование', categoryId: 'unknown-category' },
      ]),
    }).teachTags

    expect(tag.category).toBe('plus')
  })
})
