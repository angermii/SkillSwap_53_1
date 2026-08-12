import type { FormEvent } from 'react'
import clsx from 'clsx'
import { Button, EditableField, EditableSelect } from '@/shared/ui'
import { DatePicker } from '@/widgets/DatePicker'
import { UserPhoto } from '@/widgets/userPhoto'
import styles from './UserDashboard.module.css'
import type { UserDashboardProps } from './type'

export const UserDashboard = ({
  data,
  genderOptions,
  cityOptions,
  isSaveDisabled = false,
  avatarError,
  errors,
  onFieldChange,
  onBirthDateChange,
  onNewAvatarClick,
  onChangePassword,
  onSave,
  className,
}: UserDashboardProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave()
  }

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <div className={styles.emailBlock}>
          <EditableField
            label="Почта"
            value={data.email}
            onSave={(value) => onFieldChange('email', value)}
            editLabel="Изменить почту"
          />
          {errors?.email && (
            <span className={styles.fieldError} role="alert">
              {errors.email}
            </span>
          )}

          <button type="button" className={styles.passwordButton} onClick={onChangePassword}>
            Изменить пароль
          </button>
        </div>

        <EditableField
          label="Имя"
          value={data.name}
          onSave={(value) => onFieldChange('name', value)}
          editLabel="Изменить имя"
        />
        {errors?.name && (
          <span className={styles.fieldError} role="alert">
            {errors.name}
          </span>
        )}

        <div className={styles.fieldsRow}>
          <div className={styles.fieldGroup}>
            <DatePicker
              label="Дата рождения"
              value={data.birthDate}
              onChange={onBirthDateChange}
              className={styles.datePicker}
            />
            {errors?.birthDate && (
              <span className={styles.fieldError} role="alert">
                {errors.birthDate}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <EditableSelect
              label="Пол"
              editable={false}
              value={data.gender}
              placeholder="Не указан"
              options={genderOptions}
              onChange={(value) => onFieldChange('gender', value)}
              editLabel="Изменить пол, недоступно"
            />
            {errors?.gender && (
              <span className={styles.fieldError} role="alert">
                {errors.gender}
              </span>
            )}
          </div>
        </div>

        <EditableSelect
          label="Город"
          value={data.city}
          placeholder="Не указан"
          options={cityOptions}
          onChange={(value) => onFieldChange('city', value)}
          editLabel="Изменить город"
        />
        {errors?.city && (
          <span className={styles.fieldError} role="alert">
            {errors.city}
          </span>
        )}

        <EditableField
          multiline
          rows={4}
          label="О себе"
          value={data.about}
          onSave={(value) => onFieldChange('about', value)}
          editLabel="Изменить описание"
          wrapperClassName={styles.about}
        />
        {errors?.about && (
          <span className={styles.fieldError} role="alert">
            {errors.about}
          </span>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isSaveDisabled}
          className={styles.saveButton}
        >
          Сохранить
        </Button>
      </div>

      <div className={styles.photo}>
        <UserPhoto src={data.avatarUrl} alt="Фото пользователя" onClick={onNewAvatarClick} />

        {avatarError && (
          <span className={styles.avatarError} role="alert">
            {avatarError}
          </span>
        )}
      </div>
    </form>
  )
}
