// Номера шагов регистрации, которые отображает RegistrationForm
export type RegistrationStep = 2 | 3

export type RegistrationOption = {
  name: string
  value: string
}

// данные, которые пользователь заполняет на втором и третьем шаге
export type RegistrationFormData = {
  name: string
  birthDate: Date | undefined
  gender: string
  city: string
  learningCategory: string
  learningSubcategory: string
  learningSubcategoryIds: string[]
  skillName: string
  skillCategory: string
  skillSubcategory: string
  skillDescription: string
  avatarUrl: string
  skillImages: File[]
}

// текстовые поля, которые можно изменять через общий обработчик onFieldChange
export type RegistrationTextField = Exclude<
  keyof RegistrationFormData,
  'avatarUrl' | 'skillImages' | 'birthDate' | 'learningSubcategoryIds'
>

// сообщения об ошибках для текстовых полей и списков формы
export type RegistrationFormErrors = Partial<Record<RegistrationTextField | 'birthDate', string>>

// данные и обработчики, которые RegistrationForm получает от родительского компонента
export type RegistrationFormProps = {
  currentStep: RegistrationStep
  data: RegistrationFormData
  errors?: RegistrationFormErrors

  // варианты для выпадающих списков
  genderOptions: RegistrationOption[]
  cityOptions: RegistrationOption[]
  categoryOptions: RegistrationOption[]
  learningSubcategoryOptions: RegistrationOption[]
  skillSubcategoryOptions: RegistrationOption[]
  selectedLearningSubcategories: RegistrationOption[]

  // обработчики изменения данных и переходов между шагами
  onFieldChange: (field: RegistrationTextField, value: string) => void
  onBirthDateChange: (date: Date | undefined) => void
  onAvatarChange: (file: File | null) => void
  onImagesChange: (files: File[]) => void
  onBack: () => void
  onNext: () => void
  onRemoveLearningSubcategory: (subcategoryId: string) => void
}
