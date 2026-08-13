

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Безопасно парсит дату из строки; возвращает undefined, если строка пуста или дата некорректна */
export function parseSafeDate(value?: string): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** Рассчитывает полный возраст по дате рождения */
export function calculateAge(birthDate: string, today = new Date()): number {
  const birth = parseSafeDate(birthDate)

  if (!birth || birth > today) {
    return 0
  }

  let age = today.getFullYear() - birth.getFullYear()

  const birthdayHasNotPassed =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())

  if (birthdayHasNotPassed) {
    age -= 1
  }

  return Math.max(age, 0)
}
