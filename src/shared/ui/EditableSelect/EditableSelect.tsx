import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { ChevronDownIcon } from '../icons'
import { IconButton } from '../iconButton'
import { Select } from '../Select'
import selectStyles from '../Select/Select.module.css'
import styles from './EditableSelect.module.css'
import type { EditableSelectProps } from './type'

export const EditableSelect = ({
  label,
  value,
  defaultValue = '',
  options = [],
  placeholder = 'Не выбрано',
  editable = true,
  isEditing,
  onEditingChange,
  onChange,
  className,
  editLabel = 'Изменить значение',
}: EditableSelectProps) => {
  const [innerValue, setInnerValue] = useState(defaultValue)
  const isValueControlled = value !== undefined
  const currentValue = isValueControlled ? value : innerValue

  const [innerEditing, setInnerEditing] = useState(false)
  const isEditingControlled = isEditing !== undefined
  // editable={false} перекрывает всё: в режим редактирования не попадаем ни при каких условиях
  const editing = editable && (isEditingControlled ? isEditing : innerEditing)

  const currentName = options.find((item) => item.value === currentValue)?.name ?? ''

  const setEditing = (next: boolean) => {
    if (!isEditingControlled) {
      setInnerEditing(next)
    }
    onEditingChange?.(next)
  }

  const handleChange = (nextValue: string) => {
    if (!isValueControlled) setInnerValue(nextValue)
    onChange?.(nextValue)
    setEditing(false)
  }

  // Режим редактирования: Select сам покажет текущее значение, потому что получает value
  // Режим редактирования работает только при повторном нажатии на кнопку, из-за реализации Select
  // Обойти это не меняя Select можно только найдя внутреннюю кнопку через ref и програмно кликнуть по ней
  const selectWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing) {
      // Находим корневой div компонента Select (он содержит класс selectWrapper)
      const rootDiv = selectWrapperRef.current?.querySelector(`.${selectStyles.selectWrapper}`)
      // Находим внутри кнопку-триггер (у неё класс placeholder)
      const triggerButton = rootDiv?.querySelector(`.${selectStyles.placeholder}`)

      // Программно кликаем по ней, чтобы раскрыть список
      if (triggerButton instanceof HTMLElement) {
        triggerButton.click()
      }
    }
  }, [editing]) // Срабатывает только когда editing меняется на true

  if (editing) {
    return (
      <div ref={selectWrapperRef} className={clsx(styles.root, className)}>
        <Select
          label={label}
          value={currentValue}
          placeholder={placeholder}
          options={options}
          onChange={handleChange}
          className={clsx(styles.select, className)}
        />
      </div>
    )
  }

  // Режим просмотра
  return (
    <div className={clsx(styles.root, className)}>
      {label && <p className={styles.label}>{label}</p>}

      <div className={styles.wrapper}>
        <span className={clsx(styles.value, !currentName && styles.placeholder)}>
          {currentName || placeholder}
        </span>

        {editable ? (
          <IconButton
            icon={<ChevronDownIcon aria-hidden="true" />}
            isActive={false}
            onClick={() => setEditing(true)}
            aria-label={editLabel}
          />
        ) : (
          <ChevronDownIcon className={styles.icon} aria-hidden="true" />
        )}
      </div>
    </div>
  )
}
