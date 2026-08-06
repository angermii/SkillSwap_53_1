import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { ROUTES } from '@/shared/lib/constants'
import { clearAuthUser } from '@/features/auth/model/authUtils'
import { LogoutIcon } from '../icons'
import type { AccountMenuProps } from './type'
import styles from './AccountMenu.module.css'

export const AccountMenu = ({ onItemClick, onLogout, className }: AccountMenuProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthUser()
    onLogout?.()
    onItemClick?.()
    navigate(ROUTES.HOME)
  }

  return (
    <div className={clsx(styles.menu, className)} role="menu">
      <Link to={ROUTES.PROFILE} className={styles.item} role="menuitem" onClick={onItemClick}>
        Личный кабинет
      </Link>

      <button type="button" className={styles.item} role="menuitem" onClick={handleLogout}>
        <span>Выйти из аккаунта</span>
        <LogoutIcon aria-hidden="true" className={styles.icon} />
      </button>
    </div>
  )
}