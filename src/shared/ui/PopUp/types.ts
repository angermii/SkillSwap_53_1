export interface PopUpProps {
  userName: string
  type?: 'withButton' | 'withoutButton'
  onClickClose?: () => void
  onClickButton?: () => void
}
