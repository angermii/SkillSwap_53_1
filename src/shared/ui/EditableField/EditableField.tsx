import { forwardRef, useEffect, useCallback, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import clsx from 'clsx'
import { CloseIcon, DoneIcon, EditIcon } from '../icons'
import { IconButton } from '../iconButton'
import { Input } from '../input'
import type { InputRef } from '../input'
import styles from './EditableField.module.css'
import type { EditableFieldProps } from './type'

export const EditableField = forwardRef<InputRef, EditableFieldProps>(function EditableField(
  {
    label,
    value,
    defaultValue = '',
    disabled = false,
    isEditing,
    onEditingChange,
    onChange,
    onSave,
    onCancel,
    className,
    wrapperClassName,
    inputClassName,
    multiline = false,
    rows,
    editLabel = 'Редактировать',
    saveLabel = 'Сохранить',
    cancelLabel = 'Отменить',
  },
  ref,
) {
  const inputRef = useRef<InputRef | null>(null)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const isValueControlled = value !== undefined
  const currentValue = isValueControlled ? value : innerValue
  const [innerEditing, setInnerEditing] = useState(false)
  const isEditingControlled = isEditing !== undefined
  const editing = isEditingControlled ? isEditing : innerEditing
  /** Черновик: правки живут здесь до сохранения, поэтому отмена ничего не ломает */
  const [draft, setDraft] = useState(currentValue)
  /** Актуальное значение для эффекта ниже — чтобы не добавлять его в зависимости */
  const valueRef = useRef(currentValue)
  valueRef.current = currentValue

  // Реализация вместо useImperativeHandle(ref, () => inputRef.current as InputRef, []), вместо него колбэк-реф
  const handleRef = useCallback(
    (node: InputRef | null) => {
      // Обновляем внутренний реф (нужен для useEffect с фокусом)
      inputRef.current = node

      // Прокидываем актуальный DOM-узел во внешний ref
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<InputRef | null>).current = node
      }
    },
    [ref],
  )

  useEffect(() => {
    if (!editing) {
      return
    }

    setDraft(valueRef.current)
    const input = inputRef.current
    if (!input) {
      return
    }

    input.focus()
    requestAnimationFrame(() => {
      const caret = input.value.length
      input.setSelectionRange(caret, caret)
    })
  }, [editing])

  const setEditing = (next: boolean) => {
    if (!isEditingControlled) {
      setInnerEditing(next)
    }
    onEditingChange?.(next)
  }

  const handleStartEditing = () => {
    if (disabled) {
      return
    }
    setEditing(true)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraft(event.target.value)
    onChange?.(event.target.value)
  }

  const handleSave = () => {
    if (!isValueControlled) {
      setInnerValue(draft)
    }
    onSave?.(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(currentValue)
    onCancel?.()
    setEditing(false)
  }

  const actions = editing ? (
    <span className={styles.actions}>
      <IconButton
        icon={<DoneIcon aria-hidden="true" />}
        isActive={false}
        onClick={handleSave}
        aria-label={saveLabel}
      />
      <IconButton
        icon={<CloseIcon aria-hidden="true" />}
        isActive={false}
        onClick={handleCancel}
        aria-label={cancelLabel}
      />
    </span>
  ) : (
    <IconButton
      icon={<EditIcon aria-hidden="true" />}
      isActive={false}
      onClick={handleStartEditing}
      disabled={disabled}
      aria-label={editLabel}
    />
  )

  const inputProps = {
    ref: inputRef,
    label,
    value: editing ? draft : currentValue,
    readOnly: !editing,
    disabled,
    onChange: handleChange,
    rightIcon: actions,
    multiline,
    rows,
    className: clsx(styles.root, className),
    wrapperClassName: clsx(
      styles.wrapper,
      !editing && styles.readOnly,
      multiline && styles.wrapperMultiline,
      wrapperClassName,
    ),
    inputClassName: clsx(styles.input, multiline && styles.textarea, inputClassName),
  }

  return multiline ? (
    <Input {...inputProps} ref={handleRef} multiline />
  ) : (
    <Input {...inputProps} ref={handleRef} />
  )
})
