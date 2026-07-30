import Styles from './Select.module.css'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { option, SelectProps } from '@/shared/ui/Select/type.ts'

export function Select({ label, placeholder, iconSrc, options = [], onChange, className, ...restProps }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<option | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  return (
    <div {...restProps} className={clsx(Styles.selectWrapper, className)}>
      <p className={Styles.label}>{label}</p>
      <div ref={ref} className={Styles.select}>
        <div
          className={clsx(Styles.placeholder, { [Styles.opened]: isOpen })}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected ? (
            <p>{selected.name}</p>
          ) : (
            <p className={Styles.placeholderText}>{placeholder}</p>
          )}
          {iconSrc ? (
            <img src={iconSrc} alt="" />
          ) : (
            <img src="public/chevron.svg" alt="" className={clsx({ [Styles.open]: isOpen })} />
          )}
        </div>
        {isOpen && (
          <div className={Styles.options}>
            {options.map((option, index) => (
              <div
                key={index}
                className={clsx(Styles.option, {
                  [Styles.selected]: selected?.name === option.name,
                })}
                onClick={() => {
                  setSelected(option)
                  setIsOpen(false)
                  if (onChange) {
                    onChange(option.value ?? '')
                  }
                }}
              >
                <p>{option.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
