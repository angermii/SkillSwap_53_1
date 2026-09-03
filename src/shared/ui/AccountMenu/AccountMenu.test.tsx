import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { AccountMenu } from './AccountMenu'
import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'

const renderMenu = (props: Partial<Parameters<typeof AccountMenu>[0]> = {}) =>
  render(
    <MemoryRouter>
      <AccountMenu onItemClick={vi.fn()} {...props} />
    </MemoryRouter>,
  )

vi.mock('@/shared/ui/icons/LogoutIcon.svg?react', () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="logout-icon" {...props} />,
}))

describe('AccountMenu', () => {
  beforeEach(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ id: '1', name: 'Иван', email: 'a@a.ru', token: 'mock_token_1' }),
    )
  })

  it('renders profile link and logout button', () => {
    renderMenu()

    expect(screen.getByRole('menuitem', { name: 'Личный кабинет' })).toHaveAttribute(
      'href',
      '/profile',
    )
    expect(screen.getByRole('menuitem', { name: /Выйти из аккаунта/ })).toBeInTheDocument()
  })

  it('calls onItemClick when profile link is clicked', () => {
    const onItemClick = vi.fn()
    renderMenu({ onItemClick })

    fireEvent.click(screen.getByRole('menuitem', { name: 'Личный кабинет' }))

    expect(onItemClick).toHaveBeenCalledTimes(1)
  })

  it('clears auth user and calls onLogout/onItemClick on logout', () => {
    const onItemClick = vi.fn()
    const onLogout = vi.fn()
    renderMenu({ onItemClick, onLogout })

    fireEvent.click(screen.getByRole('menuitem', { name: /Выйти из аккаунта/ }))

    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)).toBeNull()
    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onItemClick).toHaveBeenCalledTimes(1)
  })
})
