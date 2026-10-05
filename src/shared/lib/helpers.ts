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

// date to string dd.mm.yyyy
export const formatDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

// parse string dd.mm.yyyy to date
export const parseDateInput = (value: string): Date | undefined => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  if (!match) return undefined

  const [, dayString, monthString, yearString] = match
  const day = Number(dayString)
  const month = Number(monthString)
  const year = Number(yearString)

  const date = new Date(year, month - 1, day)

  // Проверка календарной корректности, например, исключает 31.02.2000
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }

  return date
}
