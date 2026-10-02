import clsx from 'clsx'

import styles from './Sidebar.module.css'
import type { SidebarProps } from './type'
import { useEffect, useRef } from 'react'

export const Sidebar = <Id extends string>({
  items,
  activeId,
  onSelect,
  ariaLabel = 'Навигация профиля',
  className,
  ...props
}: SidebarProps<Id>) => {
  const activeItemRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activeId])

  return (
    <aside {...props} className={clsx(styles.sidebar, className)}>
      <nav aria-label={ariaLabel}>
        <ul className={styles.list}>
          {items.map(({ id, label, icon }) => {
            const isActive = id === activeId

            return (
              <li key={id} ref={isActive ? activeItemRef : null}>
                <button
                  type="button"
                  aria-current={isActive || undefined}
                  className={clsx(styles.item, isActive && styles.active)}
                  onClick={() => onSelect(id)}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {icon}
                  </span>

                  <span className={styles.label}>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
