import { describe, expect, it } from 'vitest'

import { formatDate, generateId, parseSafeDate, truncate } from './helpers'

describe('helpers', () => {
  describe('formatDate', () => {
    it('форматирует ISO-дату в читаемый русский вид', () => {
      expect(formatDate('2026-01-15T10:00:00.000Z')).toBe('15 января 2026 г.')
    })
  })

  describe('truncate', () => {
    it('не изменяет строку короче лимита', () => {
      expect(truncate('Привет', 10)).toBe('Привет')
    })

    it('не изменяет строку ровно по лимиту', () => {
      expect(truncate('Привет', 6)).toBe('Привет')
    })

    it('обрезает строку и добавляет многоточие', () => {
      expect(truncate('Привет, мир!', 6)).toBe('Привет...')
    })

    it('убирает висящий пробел перед многоточием', () => {
      expect(truncate('Привет мир', 7)).toBe('Привет...')
    })
  })

  describe('generateId', () => {
    it('возвращает непустую строку', () => {
      expect(generateId()).toBeTypeOf('string')
      expect(generateId().length).toBeGreaterThan(0)
    })

    it('возвращает разные значения при повторных вызовах', () => {
      expect(generateId()).not.toBe(generateId())
    })
  })

  describe('parseSafeDate', () => {
    it('возвращает undefined, если значение не передано', () => {
      expect(parseSafeDate()).toBeUndefined()
    })

    it('возвращает undefined для пустой строки', () => {
      expect(parseSafeDate('')).toBeUndefined()
    })

    it('возвращает undefined для некорректной даты', () => {
      expect(parseSafeDate('не дата')).toBeUndefined()
    })

    it('парсит корректную дату', () => {
      expect(parseSafeDate('2026-01-15T00:00:00.000Z')?.toISOString()).toBe(
        '2026-01-15T00:00:00.000Z',
      )
    })
  })
})
