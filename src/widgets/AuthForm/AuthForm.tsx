import { SocialLoginButtons } from '@/shared/ui'
import { Input } from '@/shared/ui'
import { PasswordInput } from '@/shared/ui'
import { Button } from '@/shared/ui'
import React, { useState } from 'react'

export type AuthFormProps = {
  variant: 'login' | 'register'
  onGoogleClick: () => void
  onAppleClick: () => void
  onSubmit: (data: { email: string; password: string }) => void
}

export const AuthForm = ({ variant, onGoogleClick, onAppleClick, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setisPasswordVisible] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handlePasswordVisibleChange = (isVidible: boolean) => {
    setisPasswordVisible(isVidible)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  const isRegister = variant === 'register'

  const passwordPlaceholder = !isRegister ? 'Введите ваш пароль' : ''

  const passwordHint = !isRegister ? undefined : undefined

  const submitButtonText = isRegister ? 'Далее' : 'Войти'

  return ()
}
