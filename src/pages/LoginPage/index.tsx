import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'

import { LightBulbIllustration } from '@/shared/illustrations'
import { Onboarding, StepIndicator, ModalUI, Button } from '@/shared/ui'
import { RegistrationForm, UserSkillWidget, AuthForm } from '@/widgets'
import type { RegistrationFormData, RegistrationFormErrors } from '@/widgets'

import styles from './LoginPage.module.css'
import { ROUTES, SKILL_CATEGORIES } from '@/shared/lib/constants'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/features/auth'

type RegistrationStep = 1 | 2 | 3

const initialRegistrationData: RegistrationFormData = {
  name: '',
  birthDate: '',
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

const categoryOptions = SKILL_CATEGORIES.map((category) => ({
  name: category,
  value: category,
}))

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const isRegister = location.pathname === ROUTES.REGISTER

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

  const handleLogin = (data: { email: string; password: string }) => {
    dispatch(
      login({
        id: '1',
        name: 'Пользователь',
        email: data.email,
      }),
    )

    navigate(ROUTES.HOME)
  }

  const handleAuthSubmit = (data: { email: string; password: string }) => {
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

  const handleFieldChange = (
    field: keyof Omit<RegistrationFormData, 'avatarUrl' | 'skillImages'>,
    value: string,
  ) => {
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

  const handleRegistrationNext = () => {
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

  const handleFinishRegistration = () => {
    dispatch(
      login({
        id: '1',
        name: registrationData.name || 'Пользователь',
        email: registrationCredentials.email,
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
          />
        ) : (
          <RegistrationForm
            currentStep={registrationStep}
            data={registrationData}
            errors={registrationErrors}
            genderOptions={[]}
            cityOptions={[]}
            categoryOptions={categoryOptions}
            learningSubcategoryOptions={[]}
            skillSubcategoryOptions={[]}
            onFieldChange={handleFieldChange}
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
              maxThumbnails: 3
            }}
            actions={
              <div className={styles.registrationActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditRegistration}
                >
                  Редактировать
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleFinishRegistration}
                >
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
