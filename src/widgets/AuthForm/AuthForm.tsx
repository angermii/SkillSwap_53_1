import { SocialLoginButtons } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { PasswordInput } from '@/shared/ui'
import { Button } from '@/shared/ui'
import React, { useState } from 'react'
import styles from './AuthForm.module.css'

// форма имеет 2 варианта: для входа и регистрации
export type AuthFormProps = {
  variant: 'login' | 'register'
  onSubmit: (data: { email: string; password: string }) => void
  onLinkClick?: () => void
}

export const AuthForm = ({ variant, onSubmit, onLinkClick }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  // определяем режим формы
  const isRegister = variant === 'register'

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
            value={email}
            onChange={handleEmailChange}
          />
          <PasswordInput
            label="Пароль"
            placeholder={passwordPlaceholder}
            hint={passwordHint}
            value={password}
            onChange={handlePasswordChange}
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
