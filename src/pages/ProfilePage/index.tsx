import { useMemo, useState, useRef } from 'react'
import type { ChangeEvent } from 'react'

import { updateUser } from '@/features/auth'
import { BulbIcon, HeartIcon, MessageTextIcon, RequestIcon, UserIcon } from '@/shared/ui/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Footer, UserDashboard, FavoritesWidget } from '@/widgets'
import type { UserData, UserEditableField } from '@/widgets'
import { Sidebar } from '@/widgets/Sidebar'
import type { SidebarItem } from '@/widgets/Sidebar'
import styles from './ProfilePage.module.css'
import type { ProfileTab } from './type'
import {
  validateAvatarFile,
  required,
  minLength,
  maxLength,
  email,
  selectRequired,
} from '@/shared/lib/validators'

const GENDER_OPTIONS = [
  { name: 'Мужской', value: 'male' },
  { name: 'Женский', value: 'female' },
]

const CITY_OPTIONS = [
  { name: 'Москва', value: 'Москва' },
  { name: 'Санкт-Петербург', value: 'Санкт-Петербург' },
  { name: 'Новосибирск', value: 'Новосибирск' },
  { name: 'Екатеринбург', value: 'Екатеринбург' },
  { name: 'Казань', value: 'Казань' },
  { name: 'Нижний Новгород', value: 'Нижний Новгород' },
]

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)

  // cсылка позволяет открыть системное окно выбора файла по кнопке редактирования
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // ошибка валидации выбранного автара
  const [avatarError, setAvatarError] = useState('')

  // активная вкладка сайдбара: меняется только правая часть страницы
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

  // состояние для ошибок валидации
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({})

  // форма локальная, в стор уходит только по кнопке "Сохранить"
  const [formData, setFormData] = useState<UserData>({
    email: authUser?.email ?? '',
    name: authUser?.name ?? '',
    birthDate: authUser?.birthDate ? new Date(authUser.birthDate) : undefined,
    gender: authUser?.gender ?? '',
    city: authUser?.city ?? '',
    about: authUser?.description ?? '',
    avatarUrl: authUser?.avatarUrl ?? '',
  })

  const handleFieldChange = (field: UserEditableField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleBirthDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, birthDate: date }))
    setFormErrors((prev) => ({ ...prev, birthDate: undefined }))
  }

  const handleNewAvatarClick = () => {
    setAvatarError('')
    avatarInputRef.current?.click()
  }

  // Передаем выбранный файл в локальное состояние формы
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null

    // При отмене выбора сохраняем текущий аватар
    if (!file) {
      return
    }

    // проверяем формат и размер файла до замены аватара
    const error = validateAvatarFile(file)

    if (error) {
      setAvatarError(error)
      event.target.value = ''
      return
    }

    setAvatarError('')

    // Создаем временный url для предпросмотра выбранного файла
    const avatarUrl = URL.createObjectURL(file)

    setFormData((prev) => ({
      ...prev,
      avatarUrl,
    }))

    // Позволяет повторно выбрать тот же файл
    event.target.value = ''
  }

  const handleSave = () => {
    const errors: Record<string, string | undefined> = {}

    // проверяем почту, поле обязательное, корректный формат
    const emailError = required(formData.email) || email(formData.email)
    if (emailError) errors.email = emailError

    // проверяем, что имя содержит не менее 2-х и не более 50-ти символом, поле обязательное
    const nameError =
      required(formData.name) || minLength(2)(formData.name) || maxLength(50)(formData.name)
    if (nameError) errors.name = nameError

    // Дата рождения: обязательное поле
    if (!formData.birthDate) {
      errors.birthDate = 'Поле обязательно для заполнения'
    }

    // Пол: обязательное поле, выбор из списка
    const genderError = selectRequired(formData.gender)
    if (genderError) errors.gender = genderError

    // Город: обязательное поле, выбор из списка
    const cityErrors = selectRequired(formData.city)
    if (cityErrors) errors.city = cityErrors

    // О себе: необязательное поле, содержит не более 1000 символов
    const aboutError = maxLength(1000)(formData.about)
    if (aboutError) errors.about = aboutError

    setFormErrors(errors)
    if (Object.values(errors).some(Boolean)) {
      return
    }

    dispatch(
      updateUser({
        name: formData.name,
        email: formData.email,
        city: formData.city,
        gender: formData.gender as 'male' | 'female',
        description: formData.about,
        avatarUrl: formData.avatarUrl || null,
        birthDate: formData.birthDate ? formData.birthDate.toISOString() : '',
      }),
    )
  }

  const sidebarItems: SidebarItem<ProfileTab>[] = useMemo(
    () => [
      { id: 'requests', label: 'Заявки', icon: <RequestIcon /> },
      { id: 'exchanges', label: 'Мои обмены', icon: <MessageTextIcon /> },
      { id: 'favorites', label: 'Избранное', icon: <HeartIcon /> },
      { id: 'skills', label: 'Мои навыки', icon: <BulbIcon /> },
      { id: 'profile', label: 'Личные данные', icon: <UserIcon /> },
    ],
    [],
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <UserDashboard
              data={formData}
              errors={formErrors}
              avatarError={avatarError}
              genderOptions={GENDER_OPTIONS}
              cityOptions={CITY_OPTIONS}
              onFieldChange={handleFieldChange}
              onBirthDateChange={handleBirthDateChange}
              onNewAvatarClick={handleNewAvatarClick}
              onChangePassword={() => {
                // TODO: модалка смены пароля, отдельная задача
              }}
              onSave={handleSave}
            />

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png"
              hidden
              onChange={handleAvatarChange}
            />
          </>
        )
      case 'favorites':
        return <FavoritesWidget />
      // TODO: заменить заглушки на виджеты вкладок, когда они будут готовы
      default:
        return <p>Раздел в разработке</p>
    }
  }

  return (
    <div className={styles.layout}>
      <main className={styles.page}>
        <Sidebar items={sidebarItems} activeId={activeTab} onSelect={setActiveTab} />

        <div className={styles.content}>{renderTabContent()}</div>
      </main>

      <Footer />
    </div>
  )
}
