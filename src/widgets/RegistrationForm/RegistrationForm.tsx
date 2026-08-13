import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { DatePicker } from '@/widgets/DatePicker'
import {
  Avatar,
  Button,
  FilterChip,
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
  errors = {},
  genderOptions,
  cityOptions,
  categoryOptions,
  learningSubcategoryOptions,
  skillSubcategoryOptions,
  selectedLearningSubcategories,
  onFieldChange,
  onAvatarChange,
  onImagesChange,
  onBirthDateChange,
  onBack,
  onNext,
  onRemoveLearningSubcategory,
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

  // добавляет новые изображения к уже выбранным
  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newImages = Array.from(event.target.files ?? [])

    onImagesChange([...data.skillImages, ...newImages])
  }

  // добавляет перетащенные изображения к уже выбранным
  const handleImagesDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    const newImages = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )

    onImagesChange([...data.skillImages, ...newImages])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onNext()
  }

  // не отображает форму при некорректном номере шага
  if (currentStep !== 2 && currentStep !== 3) {
    return null
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
            error={errors.name}
            label="Имя"
            placeholder="Введите ваше имя"
            value={data.name}
            onChange={handleTextChange('name')}
          />

          <div className={styles.fieldsRow}>
            <div className={styles.fieldGroup}>
              <DatePicker
                label="Дата рождения"
                value={data.birthDate}
                onChange={onBirthDateChange}
                inputClassName={styles.textField}
                error={errors.birthDate}
              />

              {errors.birthDate && (
                <span className={styles.errorText} role='alert'>{errors.birthDate}</span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <Select
                label="Пол"
                value={data.gender}
                placeholder="Не указан"
                options={genderOptions}
                onChange={(value) => onFieldChange('gender', value)}
              />

              {errors.gender && (
                <span className={styles.errorText} role="alert">
                  {errors.gender}
                </span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <EditableSelect
              label="Город"
              value={data.city}
              placeholder="Не указан"
              options={cityOptions}
              onChange={(value) => onFieldChange('city', value)}
            />

            {errors.city && (
              <span className={styles.errorText} role="alert">
                {errors.city}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <Select
              label="Категория навыка, которому хотите научиться"
              value={data.learningCategory}
              placeholder="Выберите категорию"
              options={categoryOptions}
              onChange={(value) => onFieldChange('learningCategory', value)}
            />

            {errors.learningCategory && (
              <span className={styles.errorText} role="alert">
                {errors.learningCategory}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <Select
              label="Подкатегория навыка, которому хотите научиться"
              value={data.learningSubcategory}
              placeholder="Выберите подкатегорию"
              options={learningSubcategoryOptions}
              onChange={(value) => onFieldChange('learningSubcategory', value)}
            />

            {errors.learningSubcategory && (
              <span className={styles.errorText} role="alert">
                {errors.learningSubcategory}
              </span>
            )}
          </div>

          {selectedLearningSubcategories.length > 0 && (
            <div className={styles.learningSkills} aria-label="Выбранные навыки">
              {selectedLearningSubcategories.map((subcategory) => (
                <FilterChip
                  key={subcategory.value}
                  label={subcategory.name}
                  onRemove={() => onRemoveLearningSubcategory(subcategory.value)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* третий шаг - информация о навыке пользователя */}
      {currentStep === 3 && (
        <div className={styles.fields}>
          <Input
            inputClassName={styles.textField}
            error={errors.skillName}
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            value={data.skillName}
            onChange={handleTextChange('skillName')}
          />

          <div className={styles.fieldGroup}>
            <Select
              label="Категория навыка"
              value={data.skillCategory}
              placeholder="Выберите категорию навыка"
              options={categoryOptions}
              onChange={(value) => onFieldChange('skillCategory', value)}
            />

            {errors.skillCategory && (
              <span className={styles.errorText} role="alert">
                {errors.skillCategory}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <Select
              label="Подкатегория навыка"
              value={data.skillSubcategory}
              placeholder="Выберите подкатегорию навыка"
              options={skillSubcategoryOptions}
              onChange={(value) => onFieldChange('skillSubcategory', value)}
            />

            {errors.skillSubcategory && (
              <span className={styles.errorText} role="alert">
                {errors.skillSubcategory}
              </span>
            )}
          </div>

          <Input
            inputClassName={styles.textField}
            error={errors.skillDescription}
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
