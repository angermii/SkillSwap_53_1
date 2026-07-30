import { DayPicker } from '@daypicker/react'
import type { DropdownProps } from '@daypicker/react'
import { ru } from '@daypicker/react/locale'
import clsx from 'clsx'

import { ChevronDownIcon } from '../icons'
import type { CalendarProps } from './type'
import styles from './Calendar.module.css'

const CustomDropdown = ({ options, className, ...rest }: DropdownProps) => (
  <span className={styles.dropdownWrapper}>
    <select {...rest} className={className}>
      {options?.map(({ value, label, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
   <ChevronDownIcon
  width={16}
  height={7.94}
  viewBox="4 8 16 8"
  className={styles.chevronIcon}
/>
  </span>
)

export const Calendar = ({
  selected,
  onSelect,
  defaultMonth,
  fromYear = 1940,
  toYear = new Date().getFullYear(),
  className,
}: CalendarProps) => {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      defaultMonth={defaultMonth ?? selected ?? new Date()}
      startMonth={new Date(fromYear, 0)}
      endMonth={new Date(toYear, 11)}
      locale={ru}
      weekStartsOn={1}
      captionLayout="dropdown"
      hideNavigation
      showOutsideDays
      fixedWeeks
      className={clsx(styles.root, className)}
      components={{
        Dropdown: CustomDropdown,
      }}
      classNames={{
        months: styles.months,
        month: styles.month,
        month_caption: styles.monthCaption,
        dropdowns: styles.dropdowns,
        dropdown_root: styles.dropdownRoot,
        months_dropdown: styles.monthDropdown,
        years_dropdown: styles.yearDropdown,
        month_grid: styles.monthGrid,
        weekdays: styles.weekdays,
        weekday: styles.weekday,
        week: styles.week,
        day: styles.day,
        day_button: styles.dayButton,
        selected: styles.selected,
        today: styles.today,
        outside: styles.outside,
        disabled: styles.disabled,
        caption_label: styles.visuallyHidden,
      }}
    />
  )
}