import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import { LightBulbIllustration } from '@/shared/illustrations'
import { Onboarding, ModalUI, Button, StepIndicator } from '@/shared/ui'
import { RegistrationForm, UserSkillWidget, AuthForm } from '@/widgets'
import type { RegistrationFormData, RegistrationFormErrors } from '@/widgets'
import { RegistrationTextField } from '@/widgets/RegistrationForm/type'

import styles from './LoginPage.module.css'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { login, register, findRegisteredUser } from '@/features/auth'

import { fetchSkillCategories, fetchSkillSubcategories } from '@/entities/skill/model/skillSlice'
import { selectSkillCategories, selectSkillSubcategories } from '@/entities/skill/model/selectors'
import { fetchUsers } from '@/entities/user/model/userSlice'

import { required, selectRequired } from '@/shared/lib/validators'

type RegistrationStep = 1 | 2 | 3

const LOGIN_ERROR_MESSAGE =
  'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных'

const initialRegistrationData: RegistrationFormData = {
  name: '',
  birthDate: undefined,
  gender: '',
  city: '',
  learningCategory: '',
  learningSubcategory: '',
  skillName: '',
  skillCategory: '',
  skillSubcategory: '',
  skillDescription: '',
  avatarUrl: '',
  skillImages: [],
}

const genderOptions = [
  {
    name: 'Мужской',
    value: 'male',
  },
  {
    name: 'Женский',
    value: 'female',
  },
]


export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isRegister = location.pathname === ROUTES.REGISTER

  const skillCategories = useAppSelector(selectSkillCategories)
  const skillSubCategories = useAppSelector(selectSkillSubcategories)
  const users = useAppSelector((state) => state.user.items)

  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(1)
  const [registrationData, setRegistrationData] =
    useState<RegistrationFormData>(initialRegistrationData)
  const [registrationErrors, setRegistrationErrors] = useState<RegistrationFormErrors>({})
  const [registrationCredentials, setRegistrationCredentials] = useState<{
    email: string
    password: string
  }>({
    email: '',
    password: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categoryOptions = useMemo(
    () =>
      skillCategories.map((category) => ({
        name: category.title,
        value: category.id,
      })),
    [skillCategories],
  )

  const learningSubcategoryOptions = useMemo(
    () =>
      skillSubCategories
        .filter((subcategory) => subcategory.categoryId === registrationData.learningCategory)
        .map((subcategory) => ({
          name: subcategory.title,
          value: subcategory.id,
        })),
    [skillSubCategories, registrationData.learningCategory],
  )

  const skillSubcategoryOptions = useMemo(
    () =>
      skillSubCategories
        .filter((subcategory) => subcategory.categoryId === registrationData.skillCategory)
        .map((subcategory) => ({
          name: subcategory.title,
          value: subcategory.id,
        })),
    [skillSubCategories, registrationData.skillCategory],
  )

  const cityOptions = useMemo(
    () =>
      Array.from(new Set(users.map((user) => user.city)))
        .filter(Boolean)
        .map((city) => ({
          name: city,
          value: city,
        })),
    [users],
  )

  useEffect(() => {
    if (!isRegister) {
      return
    }

    dispatch(fetchSkillCategories())
    dispatch(fetchSkillSubcategories())
    dispatch(fetchUsers())
  }, [dispatch, isRegister])

  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = (data: { email: string; password: string }) => {
    const registeredUser = findRegisteredUser(data.email, data.password)

    if (!registeredUser) {
      setLoginError(LOGIN_ERROR_MESSAGE)
      return
    }

    dispatch(login(registeredUser.profile))
    navigate(ROUTES.HOME)
  }

  const handleAuthSubmit = (data: { email: string; password: string }) => {
    setLoginError(null)

    if (!isRegister) {
      handleLogin(data)
      return
    }

    setRegistrationCredentials(data)
    setRegistrationStep(2)
  }

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER)

    setRegistrationStep(1)
    setRegistrationData(initialRegistrationData)
    setRegistrationErrors({})
    setRegistrationCredentials({
      email: '',
      password: '',
    })
  }

  const handleFieldChange = (field: RegistrationTextField, value: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      [field]: value,
    }))

    setRegistrationErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleAvatarChange = (file: File | null) => {
    if (!file) {
      setRegistrationData((prev) => ({
        ...prev,
        avatarUrl: '',
      }))
      return
    }

    const avatarUrl = URL.createObjectURL(file)

    setRegistrationData((prev) => ({
      ...prev,
      avatarUrl,
    }))
  }

  const handleImagesChange = (files: File[]) => {
    setRegistrationData((prev) => ({
      ...prev,
      skillImages: files,
    }))
  }

  const handleRegistrationBack = () => {
    if (registrationStep === 2) {
      setRegistrationStep(1)
      return
    }

    if (registrationStep === 3) {
      setRegistrationStep(2)
      return
    }
  }

  const validateRegistrationStep = (): RegistrationFormErrors => {
    const errors: RegistrationFormErrors = {}

    if (registrationStep === 2) {
      const nameError = required(registrationData.name)
      const birthDateError = registrationData.birthDate ? null : 'Поле обязательно для заполнения'
      const genderError = selectRequired(registrationData.gender)
      const cityError = selectRequired(registrationData.city)
      const learningCategoryError = selectRequired(registrationData.learningCategory)
      const learningSubcategoryError = selectRequired(registrationData.learningSubcategory)

      if (nameError) {
        errors.name = nameError
      }

      if (birthDateError) {
        errors.birthDate = birthDateError
      }

      if (genderError) {
        errors.gender = genderError
      }

      if (cityError) {
        errors.city = cityError
      }

      if (learningCategoryError) {
        errors.learningCategory = learningCategoryError
      }

      if (learningSubcategoryError) {
        errors.learningSubcategory = learningSubcategoryError
      }
    }

    if (registrationStep === 3) {
      const skillNameError = required(registrationData.skillName)
      const skillCategoryError = selectRequired(registrationData.skillCategory)
      const skillSubcategoryError = selectRequired(registrationData.skillSubcategory)
      const skillDescriptionError = required(registrationData.skillDescription)

      if (skillNameError) {
        errors.skillName = skillNameError
      }

      if (skillCategoryError) {
        errors.skillCategory = skillCategoryError
      }

      if (skillSubcategoryError) {
        errors.skillSubcategory = skillSubcategoryError
      }

      if (skillDescriptionError) {
        errors.skillDescription = skillDescriptionError
      }
    }

    return errors
  }

  const handleRegistrationNext = () => {
    const errors = validateRegistrationStep()
    setRegistrationErrors(errors)
    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) {
      return
    }

    if (registrationStep === 2) {
      setRegistrationStep(3)
      return
    }

    if (registrationStep === 3) {
      setIsModalOpen(true)
    }
  }

  const handleEditRegistration = () => {
    setIsModalOpen(false)
    setRegistrationStep(3)
  }

  const getGender = (gender: string): 'male' | 'female' => {
    if (gender === 'male' || gender === 'female') {
      return gender
    }

    return 'male'
  }

  const handleFinishRegistration = () => {
    dispatch(
      register({
        password: registrationCredentials.password,
        profile: {
          id: registrationCredentials.email,
          name: registrationData.name,
          email: registrationCredentials.email,
          avatarUrl: registrationData.avatarUrl,
          gender: getGender(registrationData.gender),
          birthDate: registrationData.birthDate
          ? registrationData.birthDate.toISOString()
          : '',
          city: registrationData.city,
          description: registrationData.skillDescription,
        },
      }),
    )

    setIsModalOpen(false)
    navigate(ROUTES.HOME)
  }

  const galleryImages = useMemo(
    () =>
      registrationData.skillImages.map((file, index) => ({
        id: `${file.name}-${index}`,
        src: URL.createObjectURL(file),
        alt: `Изображение навыка ${index + 1}`,
      })),
    [registrationData.skillImages],
  )

  const userSkill = {
    title: registrationData.skillName || 'Мой навык',
    subtitle:
      registrationData.skillSubcategory || registrationData.skillCategory || 'Навык пользователя',
    description: registrationData.skillDescription || 'Описание навыка пока не заполнено',
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        {isRegister ? <StepIndicator currentStep={registrationStep} totalStep={3} /> : 'Вход'}
      </h1>

      <div className={styles.panels}>
        {!isRegister || registrationStep === 1 ? (
          <AuthForm
            variant={isRegister ? 'register' : 'login'}
            onSubmit={handleAuthSubmit}
            onLinkClick={!isRegister ? handleRegisterClick : undefined}
            submitError={!isRegister ? loginError : null}
          />
        ) : (
          <RegistrationForm
            currentStep={registrationStep}
            data={registrationData}
            errors={registrationErrors}
            genderOptions={genderOptions}
            cityOptions={cityOptions}
            categoryOptions={categoryOptions}
            learningSubcategoryOptions={learningSubcategoryOptions}
            skillSubcategoryOptions={skillSubcategoryOptions}
            onFieldChange={handleFieldChange}
            onBirthDateChange={(date) => {
              setRegistrationData((prev) => ({
                ...prev,
                birthDate: date,
              }))

              setRegistrationErrors((prev) => ({
                ...prev,
                birthDate: undefined,
              }))
            }}
            onAvatarChange={handleAvatarChange}
            onImagesChange={handleImagesChange}
            onBack={handleRegistrationBack}
            onNext={handleRegistrationNext}
          />
        )}

        <Onboarding
          illustration={<LightBulbIllustration />}
          title={isRegister ? 'Добро пожаловать в SkillSwap!' : 'С возвращением в SkillSwap!'}
          description={
            isRegister
              ? 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
              : 'Обменивайтесь знаниями и навыками с другими людьми'
          }
        />
      </div>

      {isModalOpen && (
        <ModalUI
          title="Ваше предложение"
          description="Пожалуйста, проверьте и подтвердите правильность данных"
          onClose={() => setIsModalOpen(false)}
          size="large"
        >
          <UserSkillWidget
            className={styles.registrationSkill}
            // header={{
            //   title: registrationData.name || 'Пользователь',
            //   subtitle: registrationData.city || 'Город не указан',
            // }}
            // like={{
            //   count: 0,
            //   isLiked: false,
            // }}
            skill={userSkill}
            gallery={{
              images: galleryImages,
              maxThumbnails: 3,
            }}
            actions={
              <div className={styles.registrationActions}>
                <Button type="button" variant="secondary" onClick={handleEditRegistration}>
                  Редактировать
                </Button>

                <Button type="button" variant="primary" onClick={handleFinishRegistration}>
                  Готово
                </Button>
              </div>
            }
          />
        </ModalUI>
      )}
    </main>
  )
}
