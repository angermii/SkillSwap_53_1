import type { AuthUser, Skill, User } from '@/shared/types'
import { calculateAge } from './helpers'

type AuthProfile = Omit<AuthUser, 'token'>

export function mapAuthUserToUser(profile: AuthProfile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl || null,
    gender: profile.gender,
    age: calculateAge(profile.birthDate),
    city: profile.city,
    description: profile.description,
    createdAt:
      profile.createdAt ??
      profile.skills?.[0]?.createdAt ??
      profile.skill?.createdAt ??
      new Date(0).toISOString(),
  }
}

export function getAuthUserSkills(profile: AuthProfile): Skill[] {
  if (profile.skills) {
    return profile.skills
  }

  return profile.skill ? [profile.skill] : []
}
