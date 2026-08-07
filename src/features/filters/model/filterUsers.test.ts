import { describe, expect, it } from 'vitest'

import type { Skill, SkillSubcategory, SkillType, User } from '@/shared/types'

import { filterUsers } from './filterUsers'
import { createInitialFilters, type UserFilters } from './types'

const users: User[] = [
  {
    id: 'user-1',
    name: 'Анна',
    email: 'anna@example.com',
    avatarUrl: null,
    gender: 'female',
    age: 27,
    city: 'Москва',
    description: '',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Иван',
    email: 'ivan@example.com',
    avatarUrl: null,
    gender: 'male',
    age: 31,
    city: 'Санкт-Петербург',
    description: '',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Мария',
    email: 'maria@example.com',
    avatarUrl: null,
    gender: 'female',
    age: 29,
    city: 'Казань',
    description: '',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Олег',
    email: 'oleg@example.com',
    avatarUrl: null,
    gender: 'male',
    age: 35,
    city: 'Москва',
    description: '',
    createdAt: '2026-01-01T00:00:00Z',
  },
]

const subcategories: SkillSubcategory[] = [
  {
    id: 'photography',
    title: 'Фотография',
    categoryId: 'creativity',
  },
  {
    id: 'english',
    title: 'Английский язык',
    categoryId: 'languages',
  },
  {
    id: 'cooking',
    title: 'Кулинария',
    categoryId: 'home',
  },
  {
    id: 'yoga',
    title: 'Йога',
    categoryId: 'health',
  },
]

const createSkill = (
  id: string,
  authorId: string,
  type: SkillType,
  subcategoryId: string,
): Skill => ({
  id,
  title: id,
  description: '',
  type,
  subcategoryId,
  imageUrl: null,
  authorId,
  createdAt: '2026-01-01T00:00:00Z',
  likeCount: 0,
})

const skills: Skill[] = [
  createSkill('skill-1', 'user-1', 'teach', 'photography'),
  createSkill('skill-2', 'user-1', 'learn', 'english'),
  createSkill('skill-3', 'user-2', 'teach', 'english'),
  createSkill('skill-4', 'user-2', 'learn', 'cooking'),
  createSkill('skill-5', 'user-3', 'teach', 'english'),
  createSkill('skill-6', 'user-3', 'learn', 'yoga'),
  createSkill('skill-7', 'user-4', 'learn', 'photography'),
]

const getFilteredIds = (filters: Partial<UserFilters> = {}): string[] =>
  filterUsers({
    users,
    skills,
    subcategories,
    filters: {
      ...createInitialFilters(),
      ...filters,
    },
  }).map((user) => user.id)

describe('filterUsers', () => {
  it('returns every user when filters are empty', () => {
    expect(getFilteredIds()).toEqual(['user-1', 'user-2', 'user-3', 'user-4'])
  })

  it('filters users by category', () => {
    expect(
      getFilteredIds({
        categoryIds: ['creativity'],
      }),
    ).toEqual(['user-1', 'user-4'])
  })

  it('filters users by subcategory', () => {
    expect(
      getFilteredIds({
        subcategoryIds: ['english'],
      }),
    ).toEqual(['user-1', 'user-2', 'user-3'])
  })

  it('filters users by skill type', () => {
    expect(
      getFilteredIds({
        skillType: 'teach',
      }),
    ).toEqual(['user-1', 'user-2', 'user-3'])
  })

  it('applies skill type and taxonomy to the same skill', () => {
    expect(
      getFilteredIds({
        skillType: 'teach',
        subcategoryIds: ['english'],
      }),
    ).toEqual(['user-2', 'user-3'])

    expect(
      getFilteredIds({
        skillType: 'learn',
        subcategoryIds: ['english'],
      }),
    ).toEqual(['user-1'])
  })

  it('filters users by gender', () => {
    expect(
      getFilteredIds({
        gender: 'female',
      }),
    ).toEqual(['user-1', 'user-3'])
  })

  it('filters users by one city', () => {
    expect(
      getFilteredIds({
        cities: ['Москва'],
      }),
    ).toEqual(['user-1', 'user-4'])
  })

  it('allows several cities at the same time', () => {
    expect(
      getFilteredIds({
        cities: ['Москва', 'Казань'],
      }),
    ).toEqual(['user-1', 'user-3', 'user-4'])
  })

  it('combines independent filters', () => {
    expect(
      getFilteredIds({
        skillType: 'teach',
        subcategoryIds: ['english'],
        gender: 'female',
        cities: ['Казань'],
      }),
    ).toEqual(['user-3'])
  })

  it('uses initial filters for reset', () => {
    expect(getFilteredIds(createInitialFilters())).toHaveLength(4)
  })
})
