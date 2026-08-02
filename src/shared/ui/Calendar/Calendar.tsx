import { DayPicker } from '@daypicker/react'
import { ru } from '@daypicker/react/locale'
import clsx from 'clsx'

import type { CalendarProps } from './type'
import styles from './Calendar.module.css'

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
      classNames={{
        months: styles.months,
        month: styles.month,
        month_caption: styles.monthCaption,
        dropdowns: styles.dropdowns,
        dropdown_root: styles.dropdownRoot,
        months_dropdown: styles.dropdown,
        years_dropdown: styles.dropdown,
        chevron: styles.chevron,
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