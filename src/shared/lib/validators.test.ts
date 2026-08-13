import { describe, expect, it } from 'vitest'

import {
  date,
  email,
  maxLength,
  minLength,
  password,
  required,
  selectRequired,
  validateAvatarFile,
} from './validators'

describe('validators', () => {
  describe('required', () => {
    it('возвращает ошибку для пустой строки', () => {
      expect(required('')).toBe('Поле обязательно для заполнения')
    })

    it('возвращает ошибку для строки из пробелов', () => {
      expect(required('   ')).toBe('Поле обязательно для заполнения')
    })

    it('возвращает null для заполненного поля', () => {
      expect(required('Иван')).toBeNull()
    })
  })

  describe('minLength', () => {
    it('возвращает ошибку, если строка короче минимума', () => {
      expect(minLength(5)('abc')).toBe('Минимальная длина — 5 символов')
    })

    it('возвращает null для строки нужной длины', () => {
      expect(minLength(3)('abc')).toBeNull()
    })

    it('не ругается на пустое поле — за это отвечает required', () => {
      expect(minLength(5)('')).toBeNull()
    })
  })

  describe('maxLength', () => {
    it('возвращает ошибку, если строка длиннее максимума', () => {
      expect(maxLength(3)('abcd')).toBe('Максимальная длина — 3 символов')
    })

    it('возвращает null для строки на границе', () => {
      expect(maxLength(3)('abc')).toBeNull()
    })

    it('не ругается на пустое поле', () => {
      expect(maxLength(3)('')).toBeNull()
    })
  })

  describe('email', () => {
    it('возвращает null для пустого значения', () => {
      expect(email('')).toBeNull()
    })

    it('возвращает null для корректного адреса', () => {
      expect(email('ivan@mail.ru')).toBeNull()
    })

    it.each(['ivan', 'ivan@', 'ivan@mail', '@mail.ru', 'ivan mail@mail.ru'])(
      'возвращает ошибку для «%s»',
      (value) => {
        expect(email(value)).toBe('Введите корректный email адрес')
      },
    )
  })

  describe('password', () => {
    const error = 'Пароль должен содержать заглавную букву, цифру и спецсимвол'

    it('возвращает null для пустого значения', () => {
      expect(password('')).toBeNull()
    })

    it('принимает пароль с заглавной буквой, цифрой и спецсимволом', () => {
      expect(password('Password1!')).toBeNull()
    })

    it('принимает кириллический пароль', () => {
      expect(password('Пароль1!')).toBeNull()
    })

    it('возвращает ошибку без заглавной буквы', () => {
      expect(password('password1!')).toBe(error)
    })

    it('возвращает ошибку без цифры', () => {
      expect(password('Password!')).toBe(error)
    })

    it('возвращает ошибку без спецсимвола', () => {
      expect(password('Password1')).toBe(error)
    })
  })

  describe('date', () => {
    it('возвращает null для пустого значения', () => {
      expect(date('')).toBeNull()
    })

    it('принимает корректную дату в формате ДД.ММ.ГГГГ', () => {
      expect(date('15.01.2026')).toBeNull()
    })

    it('возвращает ошибку формата для другого разделителя', () => {
      expect(date('2026-01-15')).toBe('Введите дату в формате ДД.ММ.ГГГГ')
    })

    it('возвращает ошибку для несуществующего дня', () => {
      expect(date('32.01.2026')).toBe('Введена несуществующая дата')
    })

    it('возвращает ошибку для несуществующего месяца', () => {
      expect(date('01.13.2026')).toBe('Введена несуществующая дата')
    })

    it('возвращает ошибку для 29 февраля невисокосного года', () => {
      expect(date('29.02.2025')).toBe('Введена несуществующая дата')
    })

    it('принимает 29 февраля високосного года', () => {
      expect(date('29.02.2024')).toBeNull()
    })
  })

  describe('selectRequired', () => {
    const error = 'Выберите значение из списка'

    it('возвращает ошибку для пустого массива', () => {
      expect(selectRequired([])).toBe(error)
    })

    it('возвращает null для непустого массива', () => {
      expect(selectRequired(['Москва'])).toBeNull()
    })

    it('возвращает ошибку для null', () => {
      expect(selectRequired(null)).toBe(error)
    })

    it('возвращает ошибку для undefined', () => {
      expect(selectRequired(undefined)).toBe(error)
    })

    it('возвращает ошибку для строки из пробелов', () => {
      expect(selectRequired('   ')).toBe(error)
    })

    it('возвращает null для выбранного значения', () => {
      expect(selectRequired('Москва')).toBeNull()
    })
  })

  describe('validateAvatarFile', () => {
    const makeFile = (type: string, size: number) => {
      const file = new File([''], 'avatar', { type })
      Object.defineProperty(file, 'size', { value: size })
      return file
    }

    it('принимает JPEG допустимого размера', () => {
      expect(validateAvatarFile(makeFile('image/jpeg', 1024))).toBeNull()
    })

    it('принимает PNG допустимого размера', () => {
      expect(validateAvatarFile(makeFile('image/png', 1024))).toBeNull()
    })

    it('отклоняет неподдерживаемый формат', () => {
      expect(validateAvatarFile(makeFile('image/gif', 1024))).toBe(
        'Выберите изображение в формате JPEG или PNG',
      )
    })

    it('отклоняет файл больше 2 МБ', () => {
      expect(validateAvatarFile(makeFile('image/png', 2 * 1024 * 1024 + 1))).toBe(
        'Размер изображения не должен превышать 2 МБ',
      )
    })

    it('принимает файл ровно 2 МБ', () => {
      expect(validateAvatarFile(makeFile('image/png', 2 * 1024 * 1024))).toBeNull()
    })
  })
})
