import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import styles from './Sidebar.module.css'
import type { SidebarProps } from './type'

export const Sidebar = ({
  items,
  ariaLabel = 'Навигация профиля',
  className,
  ...props
}: SidebarProps) => {
  return (
    <aside {...props} className={clsx(styles.sidebar, className)}>
      <nav aria-label={ariaLabel}>
        <ul className={styles.list}>
          {items.map(({ id, label, icon, to, end, onClick }) => (
            <li key={id}>
              <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={({ isActive }) => clsx(styles.item, isActive && styles.active)}
              >
                <span className={styles.icon} aria-hidden="true">
                  {icon}
                </span>

                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}