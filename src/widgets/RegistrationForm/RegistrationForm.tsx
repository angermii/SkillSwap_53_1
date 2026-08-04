import type { ChangeEvent, DragEvent, FormEvent } from 'react'

import {
  Avatar,
  Button,
  CalendarIcon,
  GalleryAddIcon,
  Input,
  PlusIcon,
  Select,
  EditableSelect,
  UserCircleIcon,
} from '@/shared/ui'

import styles from './RegistrationForm.module.css'
import type { RegistrationFormProps, RegistrationTextField } from './type'

// форма второго и третьего шагов регистрации
export const RegistrationForm = ({
  currentStep,
  data,
  genderOptions,
  cityOptions,
  categoryOptions,
  learningSubcategoryOptions,
  skillSubcategoryOptions,
  onFieldChange,
  onAvatarChange,
  onImagesChange,
  onBack,
  onNext,
}: RegistrationFormProps) => {
  // передает родителю изменения обычных текстовых полей
  const handleTextChange =
    (field: RegistrationTextField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFieldChange(field, event.target.value)
    }

  // передает выбранный аватар родительскому компоненту
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAvatarChange(event.target.files?.[0] ?? null)
  }

  // передает выбранные изображения навыка родительскому компоненту
  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    onImagesChange(Array.from(event.target.files ?? []))
  }

  // поддерживает перетаскивание изображений в область загрузки
  const handleImagesDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    const images = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )

    onImagesChange(images)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onNext()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* второй шаг - личные данные и навык, которому пользователь хочет научиться */}
      {currentStep === 2 && (
        <div className={styles.fields}>
          <label className={styles.avatarUpload}>
            {data.avatarUrl ? (
              <Avatar src={data.avatarUrl} alt="Аватар пользователя" size={54} />
            ) : (
              <UserCircleIcon
                className={styles.avatarPlaceholder}
                size={72}
                role="img"
                aria-label="Аватар пользователя"
              />
            )}

            <span className={styles.avatarAdd}>
              <PlusIcon size={16} />
            </span>

            <input
              className={styles.hiddenInput}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </label>

          <Input
            inputClassName={styles.textField}
            label="Имя"
            placeholder="Введите ваше имя"
            value={data.name}
            onChange={handleTextChange('name')}
          />

          <div className={styles.fieldsRow}>
            {/* временное поле до появления полноценного компонента DatePicker */}
            <Input
              inputClassName={styles.textField}
              label="Дата рождения"
              placeholder="дд.мм.гггг"
              value={data.birthDate}
              rightIcon={<CalendarIcon />}
              onChange={handleTextChange('birthDate')}
            />

            <Select
              label="Пол"
              value={data.gender}
              placeholder="Не указан"
              options={genderOptions}
              onChange={(value) => onFieldChange('gender', value)}
            />
          </div>

          <EditableSelect
            label="Город"
            value={data.city}
            placeholder="Не указан"
            options={cityOptions}
            onChange={(value) => onFieldChange('city', value)}
          />

          <Select
            label="Категория навыка, которому хотите научиться"
            value={data.learningCategory}
            placeholder="Выберите категорию"
            options={categoryOptions}
            onChange={(value) => onFieldChange('learningCategory', value)}
          />

          <Select
            label="Подкатегория навыка, которому хотите научиться"
            value={data.learningSubcategory}
            placeholder="Выберите подкатегорию"
            options={learningSubcategoryOptions}
            onChange={(value) => onFieldChange('learningSubcategory', value)}
          />
        </div>
      )}

      {/* третий шаг - информация о навыке пользователя */}
      {currentStep === 3 && (
        <div className={styles.fields}>
          <Input
            inputClassName={styles.textField}
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={data.skillName}
            onChange={handleTextChange('skillName')}
          />

          <Select
            label="Категория навыка"
            value={data.skillCategory}
            placeholder="Выберите категорию навыка"
            options={categoryOptions}
            onChange={(value) => onFieldChange('skillCategory', value)}
          />

          <Select
            label="Подкатегория навыка"
            value={data.skillSubcategory}
            placeholder="Выберите подкатегорию навыка"
            options={skillSubcategoryOptions}
            onChange={(value) => onFieldChange('skillSubcategory', value)}
          />

          <Input
            inputClassName={styles.textField}
            multiline
            label="Описание"
            placeholder="Коротко опишите, чему можете научить"
            value={data.skillDescription}
            wrapperClassName={styles.description}
            onChange={handleTextChange('skillDescription')}
          />

          <label
            className={styles.imagesUpload}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleImagesDrop}
          >
            <span>
              {data.skillImages.length > 0
                ? `Выбрано изображений: ${data.skillImages.length}`
                : 'Перетащите или выберите изображения навыка'}
            </span>

            <span className={styles.imagesAction}>
              <span className={styles.imagesIcon} aria-hidden="true">
                <GalleryAddIcon size={20} />
              </span>
              Выбрать изображения
            </span>

            <input
              className={styles.hiddenInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
          </label>
        </div>
      )}

      {/* общая навигация для обоих шагов регистрации */}
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onBack}>
          Назад
        </Button>

        <Button type="submit" variant="primary">
          Продолжить
        </Button>
      </div>
    </form>
  )
}
