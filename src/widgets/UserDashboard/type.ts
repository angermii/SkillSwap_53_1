export type ProfileOption = {
  name: string
  value: string
}

export type UserData = {
  email: string
  name: string
  birthDate?: Date
  gender: string
  city: string
  about: string
  avatarUrl: string
}

export type UserEditableField = Exclude<keyof UserData, 'birthDate' | 'avatarUrl'>

export type UserDashboardProps = {
  data: UserData
  genderOptions: ProfileOption[]
  cityOptions: ProfileOption[]
  isSaveDisabled?: boolean
  avatarError?: string
  onFieldChange: (field: UserEditableField, value: string) => void
  onBirthDateChange: (date: Date | undefined) => void
  onNewAvatarClick: () => void
  onChangePassword: () => void
  onSave: () => void
  className?: string
}
