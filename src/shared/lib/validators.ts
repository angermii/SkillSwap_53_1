/**
 * Переиспользуемые функции валидации полей формы.
 * Каждая функция проверяет одно правило и возвращает null при успехе
 * или текст ошибки при провале.
 */

export const required = (value: string): string | null => {
  if (!value || !value.trim()) {
    return 'Поле обязательно для заполнения';
  }
  return null;
};

// Используем замыкание, чтобы можно было передать минимальную длину параметром
export const minLength = (min: number) => {
  return (value: string): string | null => {
    // Если поле пустое, не ругаемся (для этого есть required)
    if (value && value.length < min) {
      return `Минимальная длина — ${min} символов`;
    }
    return null;
  };
};

export const maxLength = (max: number) => {
  return (value: string): string | null => {
    if (value && value.length > max) {
      return `Максимальная длина — ${max} символов`;
    }
    return null;
  };
};

export const email = (value: string): string | null => {
  if (!value) return null;
  // Стандартная проверка на @ и домен
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Введите корректный email адрес';
  }
  return null;
};

export const password = (value: string): string | null => {
  if (!value) return null;

  // Проверяем наличие нужных символов (поддерживаем латиницу и кириллицу)
  const hasUppercase = /[A-ZА-ЯЁ]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  // Спецсимволом считаем всё, что не буква и не цифра
  const hasSpecialChar = /[^A-Za-zА-Яа-яЁё0-9]/.test(value);

  if (!hasUppercase || !hasNumber || !hasSpecialChar) {
    return 'Пароль должен содержать заглавную букву, цифру и спецсимвол';
  }
  return null;
};

export const date = (value: string): string | null => {
  if (!value) return null;

  // 1. Проверяем формат ДД.ММ.ГГГГ
  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(value)) {
    return 'Введите дату в формате ДД.ММ.ГГГГ';
  }

  // 2. Проверяем корректность календаря (например, чтобы не было 32.13.2024)
  const [day, month, year] = value.split('.').map(Number);
  // В JS месяцы начинаются с 0, поэтому вычитаем 1
  const d = new Date(year, month - 1, day);

  const isValidCalendarDate =
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day;

  if (!isValidCalendarDate) {
    return 'Введена несуществующая дата';
  }

  return null;
};

export const selectRequired = (value: string | string[] | null | undefined): string | null => {
  // Для селектов, которые возвращают массивы (мультивыбор)
  if (Array.isArray(value)) {
    return value.length === 0 ? 'Выберите значение из списка' : null;
  }
  // Для обычных селектов
  if (!value || !String(value).trim()) {
    return 'Выберите значение из списка';
  }
  return null;
};

// проверка формата и размера загружаемого аватара

// максимальный размер аватара 2 мб в байтах
const maxAvatarSize = 2 * 1024 * 1024
const allowedAvatarTypes = ['image/jpeg', 'image/png']

export const validateAvatarFile = (file: File): string | null => {
  if (!allowedAvatarTypes.includes(file.type)) {
    return 'Выберите изображение в формате JPEG или PNG'
  }

  if (file.size > maxAvatarSize) {
    return 'Размер изображения не должен превышать 2 МБ'
  }

  return null
}
