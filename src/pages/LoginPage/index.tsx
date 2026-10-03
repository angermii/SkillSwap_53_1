import { useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import {
  LightBulbIllustration,
  SchoolBoardIllustration,
  UserInfoIllustration,
} from '@/shared/illustrations'
import { Onboarding, ModalUI, Button, StepIndicator, EditIcon } from '@/shared/ui'
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
import { selectCityOptions } from '@/entities/user/model/selectors'

import {
  dateOfBirth,
  required,
  selectRequired,
  minLength,
  maxLength,
  alphabetRegex,
} from '@/shared/lib/validators'

import { formatDateToString } from '@/shared/lib/helpers'

import type { Skill } from '@/shared/types'

type LocationState = {
  from?: Location
  openModal?: string
  skillId?: string
  authorId?: string
}

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
  learningSubcategoryIds: [],
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
  const locationState = location.state as LocationState | null
  const from = locationState?.from
  const openModalOnReturn = locationState?.openModal
  const skillId = locationState?.skillId
  const authorId = locationState?.authorId

  const skillCategories = useAppSelector(selectSkillCategories)
  const skillSubCategories = useAppSelector(selectSkillSubcategories)

  // города для выпадающего списка приходят из общего селектора (маппинг + "Другое")
  const cityOptions = useAppSelector(selectCityOptions)

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
        .filter(
          (subcategory) =>
            !registrationData.learningCategory ||
            subcategory.categoryId === registrationData.learningCategory,
        )
        .map((subcategory) => ({
          name: subcategory.title,
          value: subcategory.id,
        })),
    [skillSubCategories, registrationData.learningCategory],
  )

  const selectedLearningSubcategories = useMemo(
    () =>
      registrationData.learningSubcategoryIds.flatMap((subcategoryId) => {
        const subcategory = skillSubCategories.find((item) => item.id === subcategoryId)

        return subcategory ? [{ name: subcategory.title, value: subcategory.id }] : []
      }),
    [skillSubCategories, registrationData.learningSubcategoryIds],
  )

  const skillSubcategoryOptions = useMemo(
    () =>
      skillSubCategories
        .filter(
          (subcategory) =>
            !registrationData.skillCategory ||
            subcategory.categoryId === registrationData.skillCategory,
        )
        .map((subcategory) => ({
          name: subcategory.title,
          value: subcategory.id,
        })),
    [skillSubCategories, registrationData.skillCategory],
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

    const isSafeReturnPath =
      from?.pathname && from.pathname !== ROUTES.LOGIN && from.pathname !== ROUTES.REGISTER

    const returnPath = isSafeReturnPath ? `${from!.pathname}${from!.search ?? ''}` : ROUTES.HOME

    // Передаем флаг для открытия модалки, если он был
    const state: LocationState = {}
    if (openModalOnReturn) {
      state.openModal = openModalOnReturn
    }
    if (skillId) {
      state.skillId = skillId
    }
    if (authorId) {
      state.authorId = authorId
    }

    const hasStateKeys = Object.keys(state).length > 0
    navigate(returnPath, {
      replace: true,
      state: hasStateKeys ? state : undefined,
    })
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
    navigate(ROUTES.REGISTER, { state: location.state })

    setRegistrationStep(1)
    setRegistrationData(initialRegistrationData)
    setRegistrationErrors({})
    setRegistrationCredentials({ email: '', password: '' })
  }

  const handleFieldChange = (field: RegistrationTextField, value: string) => {
    setRegistrationData((prev) => {
      const nextData = {
        ...prev,
        [field]: value,
      }

      // выбрали категорию на шаге 2
      // старая подкатегория больше может ей не соответствовать
      if (field === 'learningCategory') {
        nextData.learningSubcategory = ''
      }

      // добавляем выбранную подкатегорию в список
      // и очищаем селекты для следующего выбора
      if (field === 'learningSubcategory') {
        const subcategory = skillSubCategories.find((item) => item.id === value)

        if (subcategory) {
          const isAlreadySelected = prev.learningSubcategoryIds.includes(value)

          nextData.learningSubcategoryIds = isAlreadySelected
            ? prev.learningSubcategoryIds
            : [...prev.learningSubcategoryIds, value]

          nextData.learningCategory = ''
          nextData.learningSubcategory = ''
        }
      }

      // то же самое для единственного навыка teach на шаге 3
      if (field === 'skillCategory') {
        nextData.skillSubcategory = ''
      }

      if (field === 'skillSubcategory') {
        const subcategory = skillSubCategories.find((item) => item.id === value)
        nextData.skillCategory = subcategory?.categoryId ?? ''
      }

      return nextData
    })

    setRegistrationErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleRemoveLearningSubcategory = (subcategoryId: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      learningSubcategoryIds: prev.learningSubcategoryIds.filter((id) => id !== subcategoryId),
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
      const nameRequiredError = required(registrationData.name)
      const nameMinLengthError = minLength(2)(registrationData.name)
        ? `Имя не может быть короче 2 символов`
        : null
      const nameMaxLengthError = maxLength(15)(registrationData.name)
        ? `Имя не может быть длиннее 15 символов`
        : null
      const nameformatError = alphabetRegex(registrationData.name)
        ? `Имя может содержать только буквы`
        : null
      const nameError =
        nameRequiredError || nameMinLengthError || nameMaxLengthError || nameformatError

      const birthDateError = registrationData.birthDate
        ? dateOfBirth(formatDateToString(registrationData.birthDate))
        : 'Поле обязательно для заполнения'
      const genderError = selectRequired(registrationData.gender)
      const cityError = selectRequired(registrationData.city)
      const learningSubcategoryError =
        registrationData.learningSubcategoryIds.length === 0 ? 'Выберите хотя бы один навык' : null

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

      if (learningSubcategoryError) {
        errors.learningSubcategory = learningSubcategoryError
      }
    }

    if (registrationStep === 3) {
      const skillNameRequeredError = required(registrationData.skillName)
      const skillNameRegexError = alphabetRegex(registrationData.skillName)
        ? 'Название навыка может содержать только буквы'
        : null
      const skillNameMinLengthError = minLength(2)(registrationData.skillName)
        ? `Название навыка не может быть короче 2 символов`
        : null
      const skillNameMaxLengthError = maxLength(30)(registrationData.skillName)
        ? `Название навыка не может быть длиннее 30 символов`
        : null
      const skillNameError =
        skillNameRequeredError ||
        skillNameRegexError ||
        skillNameMaxLengthError ||
        skillNameMinLengthError

      const skillCategoryError = selectRequired(registrationData.skillCategory)
      const skillSubcategoryError = selectRequired(registrationData.skillSubcategory)

      const skillDescriptionRequiredError = required(registrationData.skillDescription)
      const skillDescriptionMinLengthError = minLength(10)(registrationData.skillDescription)
        ? `Описание навыка не может быть короче 10 символов`
        : null
      const skillDescriptionMaxLengthError = maxLength(200)(registrationData.skillDescription)
        ? `Описание навыка не может быть длиннее 200 символов`
        : null
      const skillDescriptionError =
        skillDescriptionRequiredError ||
        skillDescriptionMinLengthError ||
        skillDescriptionMaxLengthError

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
    const authorId = registrationCredentials.email
    const createdAt = new Date().toISOString()

    const teachSkill: Skill = {
      id: crypto.randomUUID(),
      title: registrationData.skillName,
      description: registrationData.skillDescription,
      type: 'teach',
      subcategoryId: registrationData.skillSubcategory,
      imageUrl: galleryImages.map((image) => image.src),
      authorId,
      createdAt,
      likeCount: 0,
    }

    const learnSkills: Skill[] = registrationData.learningSubcategoryIds.map((subcategoryId) => {
      const subcategory = skillSubCategories.find((item) => item.id === subcategoryId)

      return {
        id: crypto.randomUUID(),
        title: subcategory?.title ?? subcategoryId,
        description: '',
        type: 'learn',
        subcategoryId,
        imageUrl: null,
        authorId,
        createdAt,
        likeCount: 0,
      }
    })

    dispatch(
      register({
        password: registrationCredentials.password,
        profile: {
          id: authorId,
          name: registrationData.name,
          email: registrationCredentials.email,
          avatarUrl: registrationData.avatarUrl,
          gender: getGender(registrationData.gender),
          birthDate: registrationData.birthDate ? registrationData.birthDate.toISOString() : '',
          city: registrationData.city,
          description: registrationData.skillDescription,
          createdAt,
          // временно оставляем для существующего личного кабинета
          skill: teachSkill,
          // новая модель всех навыков пользователя
          skills: [teachSkill, ...learnSkills],
        },
      }),
    )

    setIsModalOpen(false)

    const isSafeReturnPath =
      from?.pathname && from.pathname !== ROUTES.LOGIN && from.pathname !== ROUTES.REGISTER

    const returnPath = isSafeReturnPath ? `${from!.pathname}${from!.search ?? ''}` : ROUTES.HOME

    // Передаем флаг для открытия модалки, если он был
    const state: LocationState = {}
    if (openModalOnReturn) {
      state.openModal = openModalOnReturn
    }
    if (skillId) {
      state.skillId = skillId
    }
    if (authorId) {
      state.authorId = authorId
    }

    const hasStateKeys = Object.keys(state).length > 0
    navigate(returnPath, {
      replace: true,
      state: hasStateKeys ? state : undefined,
    })
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

  const categoryTitle = useMemo(() => {
    const category = skillCategories.find((c) => c.id === registrationData.skillCategory)
    return category?.title || ''
  }, [skillCategories, registrationData.skillCategory])

  const subcategoryTitle = useMemo(() => {
    const subcategory = skillSubCategories.find((s) => s.id === registrationData.skillSubcategory)
    return subcategory?.title || ''
  }, [skillSubCategories, registrationData.skillSubcategory])

  const userSkill = {
    title: registrationData.skillName || 'Мой навык',
    subtitle:
      categoryTitle && subcategoryTitle
        ? `${categoryTitle} / ${subcategoryTitle}`
        : subcategoryTitle || categoryTitle || 'Категория навыка',
    description: registrationData.skillDescription || 'Описание навыка пока не заполнено',
  }

  // Определяем контент для Onboarding
  const onboardingIllustration = useMemo(() => {
    if (!isRegister) return LightBulbIllustration
    switch (registrationStep) {
      case 1:
        return LightBulbIllustration
      case 2:
        return UserInfoIllustration

      case 3:
        return SchoolBoardIllustration
      default:
        return LightBulbIllustration
    }
  }, [isRegister, registrationStep])

  const onboardingTitle = useMemo(() => {
    if (isRegister) {
      switch (registrationStep) {
        case 1:
          return 'Добро пожаловать в SkillSwap!'
        case 2:
          return 'Расскажите немного о себе'
        case 3:
          return 'Укажите чем вы готовы поделиться'
        default:
          return 'Добро пожаловать в SkillSwap!'
      }
    } else {
      return 'С возвращением в SkillSwap!'
    }
  }, [isRegister, registrationStep])

  const onboardingDescription = useMemo(() => {
    if (isRegister) {
      switch (registrationStep) {
        case 1:
          return 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
        case 2:
          return 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена'
        case 3:
          return 'Так другие люди смогут увидеть ваши предложения и прелодить вам обмен!'
        default:
          return 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
      }
    } else {
      return 'Обменивайтесь знаниями и навыками с другими людьми'
    }
  }, [isRegister, registrationStep])

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
            selectedLearningSubcategories={selectedLearningSubcategories}
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
            onRemoveLearningSubcategory={handleRemoveLearningSubcategory}
          />
        )}

        <Onboarding
          illustration={onboardingIllustration}
          title={onboardingTitle}
          description={onboardingDescription}
          className={styles.onboarding}
        />
      </div>

      {isModalOpen && (
        <ModalUI onClose={() => setIsModalOpen(false)} size="large">
          <UserSkillWidget
            className={styles.registrationSkill}
            header={{
              title: 'Ваше предложение',
              subtitle: 'Пожалуйста, проверьте и подтвердите правильность данных',
            }}
            skill={userSkill}
            gallery={{
              images: galleryImages,
              maxThumbnails: 3,
            }}
            actions={
              <div className={styles.registrationActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditRegistration}
                  endIcon={<EditIcon />}
                >
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
