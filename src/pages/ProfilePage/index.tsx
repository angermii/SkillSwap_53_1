import { useEffect, useMemo, useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { parseSafeDate } from '@/shared/lib/helpers'
import { updateUser } from '@/features/auth'
import { fetchUsers } from '@/entities/user/model/userSlice'
import { selectCityOptions } from '@/entities/user/model/selectors'
import { BulbIcon, HeartIcon, MessageTextIcon, RequestIcon, UserIcon } from '@/shared/ui/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import { Footer, UserDashboard, FavoritesWidget, ProfileSkills, ExchangesWidget } from '@/widgets'

import type { UserData, UserEditableField } from '@/widgets'

import { Sidebar } from '@/widgets/Sidebar'
import type { SidebarItem } from '@/widgets/Sidebar'

import type { ProfileTab } from './type'
import styles from './ProfilePage.module.css'
import { validateAvatarFile } from '@/shared/lib/validators'

const GENDER_OPTIONS = [
  { name: 'Мужской', value: 'male' },
  { name: 'Женский', value: 'female' },
]

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((state) => state.auth.user)

  // города для выпадающего списка приходят из общего селектора (маппинг + "Другое")
  const cityOptions = useAppSelector(selectCityOptions)

  // cсылка позволяет открыть системное окно выбора файла по кнопке редактирования
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // ошибка валидации выбранного автара
  const [avatarError, setAvatarError] = useState('')

  // активная вкладка сайдбара: меняется только правая часть страницы
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

  // Локальное состояние формы.
  // В Redux данные отправляются только после нажатия "Сохранить".
  const [formData, setFormData] = useState<UserData>({
    email: authUser?.email ?? '',
    name: authUser?.name ?? '',
    birthDate: parseSafeDate(authUser?.birthDate),
    gender: authUser?.gender ?? '',
    city: authUser?.city ?? '',
    about: authUser?.description ?? '',
    avatarUrl: authUser?.avatarUrl ?? '',
  })

  // список городов строится из пользователей, поэтому их нужно загрузить
  useEffect(() => {
    void dispatch(fetchUsers())
  }, [dispatch])

  // города пользователя может не быть в списке (он сохранён как "Другое")
  const cityOptionsWithCurrent = useMemo(() => {
    const currentCity = formData.city

    if (!currentCity || cityOptions.some((option) => option.value === currentCity)) {
      return cityOptions
    }

    return [{ name: currentCity, value: currentCity }, ...cityOptions]
  }, [cityOptions, formData.city])

  const handleFieldChange = (field: UserEditableField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBirthDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date,
    }))
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
      {
        id: 'requests',
        label: 'Заявки',
        icon: <RequestIcon />,
      },
      {
        id: 'exchanges',
        label: 'Мои обмены',
        icon: <MessageTextIcon />,
      },
      {
        id: 'favorites',
        label: 'Избранное',
        icon: <HeartIcon />,
      },
      {
        id: 'skills',
        label: 'Мои навыки',
        icon: <BulbIcon />,
      },
      {
        id: 'profile',
        label: 'Личные данные',
        icon: <UserIcon />,
      },
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
              avatarError={avatarError}
              genderOptions={GENDER_OPTIONS}
              cityOptions={cityOptionsWithCurrent}
              onFieldChange={handleFieldChange}
              onBirthDateChange={handleBirthDateChange}
              onNewAvatarClick={handleNewAvatarClick}
              onChangePassword={() => {
                // TODO: модалка смены пароля
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
      
      case 'exchanges':
        return <ExchangesWidget />

      case 'favorites':
        return <FavoritesWidget />

      case 'skills':
        return <ProfileSkills />

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
