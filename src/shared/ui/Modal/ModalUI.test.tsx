import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ModalUI } from './ModalUI'

describe('ModalUI', () => {
  it('renders a title, optional icon and children', () => {
    render(
      <ModalUI title="Предложение создано" icon={<span data-testid="icon" />} onClose={vi.fn()}>
        <p>Теперь вы можете предложить обмен</p>
      </ModalUI>,
    )

    expect(screen.getByRole('dialog', { name: 'Предложение создано' })).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Теперь вы можете предложить обмен')).toBeInTheDocument()
  })

  it('calls onClose from the overlay and a child button', () => {
    const onClose = vi.fn()

    render(
      <ModalUI title="Предложение создано" onClose={onClose}>
        <button type="button" onClick={onClose}>
          Готово
        </button>
      </ModalUI>,
    )

    fireEvent.click(screen.getByTestId('modal-overlay'))
    fireEvent.click(screen.getByRole('button', { name: 'Готово' }))

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('locks background scrolling while mounted', () => {
    document.body.style.overflow = 'auto'

    const { unmount } = render(
      <ModalUI title="Предложение создано" onClose={vi.fn()}>
        <p>Содержимое</p>
      </ModalUI>,
    )

    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    unmount()

    expect(document.body).toHaveStyle({ overflow: 'auto' })
  })
})
