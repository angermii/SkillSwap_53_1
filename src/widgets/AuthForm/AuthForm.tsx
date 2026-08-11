import { Button, PasswordInput, Input, SocialLoginButtons } from '@/shared/ui'
import React, { useState } from 'react'
import { email as validateEmail, password as validatePassword, required, minLength } from '@/shared/lib/validators'

import styles from './AuthForm.module.css'

// форма имеет 2 варианта: для входа и регистрации
export type AuthFormProps = {
  variant: 'login' | 'register'
  onSubmit: (data: { email: string; password: string }) => void
  onLinkClick?: () => void
}

type AuthFormErrors = {
  email?: string,
  password?: string
}

export const AuthForm = ({ variant, onSubmit, onLinkClick }: AuthFormProps) => {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const [errors, setErrors] = useState<AuthFormErrors>({})

  // определяем режим формы
  const isRegister = variant === 'register'

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmailValue(value)

    const requiredError = required(value)
    const emailError = validateEmail(value)

    setErrors((prev) => ({
      ...prev,
      email: requiredError ?? emailError ?? undefined,
    }))
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPasswordValue(value)

    const requiredError = required(value)
    const passwordError = validatePassword(value)

    setErrors((prev) => ({
      ...prev,
      password: requiredError ?? passwordError ?? undefined,
    }))
  }

  const validateForm = (): AuthFormErrors => {
    const validationErrors: AuthFormErrors = {}

    const emailRequiredError = required(emailValue)
    const emailFormatError = validateEmail(emailValue)

    if (emailRequiredError) {
      validationErrors.email = emailRequiredError
    } else if (emailFormatError) {
      validationErrors.email = emailFormatError
    }

    const passwordRequiredError = required(passwordValue)
    const passwordLengthError = minLength(8)(passwordValue)
    const passwordFormatError = validatePassword(passwordValue)

    if (passwordRequiredError) {
      validationErrors.password = passwordRequiredError
    } else if (passwordLengthError) {
      validationErrors.password = passwordLengthError
    } else if (passwordFormatError) {
      validationErrors.password = passwordFormatError
    }
    
    return validationErrors
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateForm()
    setErrors(validationErrors)
    const hasErrors = Object.values(validationErrors).some(Boolean)

    if (hasErrors) {
      return
    }

    onSubmit({ email: emailValue, password: passwordValue })
  }

  // для режима регистрации передали undefined, чтобы использовать значение по умолчанию из PasswordInput
  // для входа передаем текст
  const passwordPlaceholder = isRegister ? undefined : 'Введите ваш пароль'

  // для режима регитрации передали undefined, чтобы использовать значение по умолчанию из PasswordInput
  // для входа пустая строка, подсказки нет
  const passwordHint = isRegister ? undefined : ''

  // меняем текст кнопки
  const submitButtonText = isRegister ? 'Далее' : 'Войти'

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.formContent}>
        <SocialLoginButtons />
        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span className={styles.dividerText}>или</span>
          <div className={styles.line}></div>
        </div>
        <div className={styles.inputWrapper}>
          <Input
            label="Email"
            placeholder="Введите email"
            value={emailValue}
            onChange={handleEmailChange}
            error={errors.email}
          />
          <PasswordInput
            label="Пароль"
            placeholder={passwordPlaceholder}
            hint={passwordHint}
            value={passwordValue}
            onChange={handlePasswordChange}
            error={errors.password}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button className={styles.button} type="submit">
          {submitButtonText}
        </Button>
        {!isRegister && onLinkClick && (
          <button type="button" className={styles.link} onClick={onLinkClick}>
            Зарегистрироваться
          </button>
        )}
      </div>
    </form>
  )
}
