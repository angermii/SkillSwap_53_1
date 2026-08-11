import clsx from 'clsx'

import styles from './Sidebar.module.css'
import type { SidebarProps } from './type'

export const Sidebar = <Id extends string>({
  items,
  activeId,
  onSelect,
  ariaLabel = 'Навигация профиля',
  className,
  ...props
}: SidebarProps<Id>) => {
  return (
    <aside {...props} className={clsx(styles.sidebar, className)}>
      <nav aria-label={ariaLabel}>
        <ul className={styles.list}>
          {items.map(({ id, label, icon }) => {
            const isActive = id === activeId

            return (
              <li key={id}>
                <button
                  type="button"
                  aria-current={isActive || undefined}
                  className={clsx(styles.item, isActive && styles.active)}
                  onClick={() => onSelect(id)}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {icon}
                  </span>

                  <span>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
