import { useMemo, useState } from 'react'

import { updateUser } from '@/features/auth'
import {
  BulbIcon,
  HeartIcon,
  MessageTextIcon,
  RequestIcon,
  UserIcon,
} from '@/shared/ui/icons'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

import {
  Footer,
  UserDashboard,
  FavoritesWidget,
  ProfileSkills,
} from '@/widgets'

import type { UserData, UserEditableField } from '@/widgets'

import { Sidebar } from '@/widgets/Sidebar'
import type { SidebarItem } from '@/widgets/Sidebar'

import type { ProfileTab } from './type'
import styles from './ProfilePage.module.css'

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

  // Активная вкладка сайдбара.
  // При переключении меняется только содержимое правой части /profile.
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')

  // Локальное состояние формы.
  // В Redux данные отправляются только после нажатия "Сохранить".
  const [formData, setFormData] = useState<UserData>({
    email: authUser?.email ?? '',
    name: authUser?.name ?? '',
    birthDate: authUser?.birthDate
      ? new Date(authUser.birthDate)
      : undefined,
    gender: authUser?.gender ?? '',
    city: authUser?.city ?? '',
    about: authUser?.description ?? '',
    avatarUrl: authUser?.avatarUrl ?? '',
  })

  const handleFieldChange = (
    field: UserEditableField,
    value: string,
  ) => {
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

  const handleSave = () => {
    dispatch(
      updateUser({
        name: formData.name,
        email: formData.email,
        city: formData.city,
        gender: formData.gender as 'male' | 'female',
        description: formData.about,
        avatarUrl: formData.avatarUrl || null,
        birthDate: formData.birthDate
          ? formData.birthDate.toISOString()
          : '',
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
          <UserDashboard
            data={formData}
            genderOptions={GENDER_OPTIONS}
            cityOptions={CITY_OPTIONS}
            onFieldChange={handleFieldChange}
            onBirthDateChange={handleBirthDateChange}
            onNewAvatarClick={() => {
              // TODO: подключить реальную загрузку файла
            }}
            onChangePassword={() => {
              // TODO: модалка смены пароля
            }}
            onSave={handleSave}
          />
        )

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
        <Sidebar
          items={sidebarItems}
          activeId={activeTab}
          onSelect={setActiveTab}
        />

        <div className={styles.content}>
          {renderTabContent()}
        </div>
      </main>

      <Footer />
    </div>
  )
}