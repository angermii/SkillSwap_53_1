import { createSelector } from '@reduxjs/toolkit'
import type { SkillState } from './skillSlice'
import type { SkillCategory, SkillSubcategory } from './types'

type StateWithSkill = { skill: SkillState }

// Данные

export const selectSkills = (state: StateWithSkill): SkillState['skills'] => state.skill.skills

export const selectSelectedSkill = (state: StateWithSkill): SkillState['selectedSkill'] =>
  state.skill.selectedSkill

export const selectSkillCategories = (state: StateWithSkill): SkillCategory[] =>
  state.skill.categories

export const selectSkillSubcategories = (state: StateWithSkill): SkillSubcategory[] =>
  state.skill.subcategories

// id

export const selectSkillCategoriesById = createSelector(
  [selectSkillCategories],
  (categories) => new Map(categories.map((category) => [category.id, category])),
)

export const selectSkillSubcategoriesById = createSelector(
  [selectSkillSubcategories],
  (subcategories) => new Map(subcategories.map((subcategory) => [subcategory.id, subcategory])),
)

export const selectSkillCategoryById = (state: StateWithSkill, id: string): SkillCategory | null =>
  selectSkillCategoriesById(state).get(id) ?? null

export const selectSkillSubcategoryById = (
  state: StateWithSkill,
  id: string,
): SkillSubcategory | null => selectSkillSubcategoriesById(state).get(id) ?? null

// Loading

export const selectSkillsLoading = (state: StateWithSkill): boolean => state.skill.loading.skills

export const selectSelectedSkillLoading = (state: StateWithSkill): boolean =>
  state.skill.loading.selectedSkill

export const selectSkillCategoriesLoading = (state: StateWithSkill): boolean =>
  state.skill.loading.categories

export const selectSkillSubcategoriesLoading = (state: StateWithSkill): boolean =>
  state.skill.loading.subcategories

// Error

export const selectSkillsError = (state: StateWithSkill): string | null => state.skill.error.skills

export const selectSelectedSkillError = (state: StateWithSkill): string | null =>
  state.skill.error.selectedSkill

export const selectSkillCategoriesError = (state: StateWithSkill): string | null =>
  state.skill.error.categories

export const selectSkillSubcategoriesError = (state: StateWithSkill): string | null =>
  state.skill.error.subcategories
