import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import { Calendar, DatePickerActions, Dropdown, Input } from '@/shared/ui'
import { CalendarIcon } from '@/shared/ui/icons'
import type { DatePickerProps } from './type'
import styles from './DatePicker.module.css'

const formatDate = (date?: Date): string => {
  if (!date || Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day}.${month}.${date.getFullYear()}`
}

export const DatePicker = ({
  value,
  onChange,
  label,
  placeholder = 'дд.мм.гггг',
  name,
  fromYear,
  toYear,
  confirmText,
  cancelText,
  className,
  inputClassName,
  dropdownClassName,
  ...props
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  // Черновик: дата, выбранная в календаре, но ещё не подтверждённая кнопкой «Выбрать»
  const [draftDate, setDraftDate] = useState<Date | undefined>(value)
  // Текст в поле — на этом этапе не влияет на draftDate, ввод без валидации/парсинга (отдельная задача)
  const [inputText, setInputText] = useState(formatDate(value))

  useEffect(() => {
    if (!isOpen) {
      setInputText(formatDate(value))
    }
  }, [value, isOpen])

  const handleOpen = () => {
    setDraftDate(value)
    setInputText(formatDate(value))
    setIsOpen(true)
  }

  const handleCancel = useCallback(() => {
    setDraftDate(value)
    setInputText(formatDate(value))
    setIsOpen(false)
  }, [value])

  const handleConfirm = () => {
    onChange(draftDate)
    setIsOpen(false)
  }

  const handleSelect = (date: Date | undefined) => {
    setDraftDate(date)
    setInputText(formatDate(date))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const trigger = (
    <Input
      name={name}
      label={label}
      placeholder={placeholder}
      value={inputText}
      onChange={handleInputChange}
      onFocus={handleOpen}
      inputClassName={clsx(styles.input, inputClassName)}
      rightIcon={
        <button
          type="button"
          className={styles.calendarButton}
          onClick={handleOpen}
          aria-label="Открыть календарь"
        >
          <CalendarIcon aria-hidden="true" />
        </button>
      }
      aria-haspopup="menu"
      aria-expanded={isOpen}
    />
  )

  return (
    <Dropdown
      {...props}
      trigger={trigger}
      isOpen={isOpen}
      onClose={handleCancel}
      className={clsx(styles.root, className)}
      contentClassName={clsx(styles.dropdown, dropdownClassName)}
    >
      <Calendar
        selected={draftDate}
        onSelect={handleSelect}
        fromYear={fromYear}
        toYear={toYear}
        className={styles.calendar}
      />

      <DatePickerActions
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmDisabled={!draftDate}
        confirmText={confirmText}
        cancelText={cancelText}
        className={styles.actions}
      />
    </Dropdown>
  )
}
