import type { AuthUser } from '@/shared/types'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

export interface RegisteredUser {
  password: string
  profile: Omit<AuthUser, 'token'>
}

function writeRegisteredUsers(users: RegisteredUser[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users))
}

/** Читает список зарегистрированных пользователей */
export function getRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS)
    return raw ? (JSON.parse(raw) as RegisteredUser[]) : []
  } catch {
    return []
  }
}

/** Добавляет или перезаписывает пользователя в реестре (ключ — email) */
export function saveRegisteredUser(user: RegisteredUser): void {
  const users = getRegisteredUsers()
  const index = users.findIndex((item) => item.profile.email === user.profile.email)

  if (index === -1) {
    users.push(user)
  } else {
    users[index] = user
  }

  writeRegisteredUsers(users)
}

/** Точечно обновляет профиль в реестре, не трогая пароль */
export function updateRegisteredUser(
  email: string,
  changes: Partial<Omit<AuthUser, 'token'>>,
): void {
  const users = getRegisteredUsers()
  const index = users.findIndex((item) => item.profile.email === email)

  if (index === -1) return

  users[index] = { ...users[index], profile: { ...users[index].profile, ...changes } }
  writeRegisteredUsers(users)
}

/** Ищет зарегистрированного пользователя по email и паролю */
export function findRegisteredUser(email: string, password: string): RegisteredUser | null {
  const normalizedEmail = email.trim().toLowerCase()

  return (
    getRegisteredUsers().find(
      (user) => user.profile.email.toLowerCase() === normalizedEmail && user.password === password,
    ) ?? null
  )
}

/** Читает текущего авторизованного пользователя из localStorage */
export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** Сохраняет пользователя и mock-токен в localStorage */
export function saveAuthUser(user: Omit<AuthUser, 'token'>): AuthUser {
  const authUser: AuthUser = { ...user, token: 'mock_token_' + user.id }
  localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(authUser))
  return authUser
}

/** Удаляет пользователя из localStorage (logout) */
export function clearAuthUser(): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER)
}
