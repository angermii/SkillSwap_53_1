import Styles from './PopUp.module.css'
import { BulbIcon, Button, CloseIcon } from '@/shared/ui'
import { PopUpProps } from '@/shared/ui/PopUp/types.ts'

export const PopUp = ({
  userName,
  type = 'withoutButton',
  onClickClose,
  onClickButton,
}: PopUpProps) => {
  return (
    <div className={Styles.Wrapper}>
      <button onClick={onClickClose} className={Styles.Close}>
        <CloseIcon />
      </button>
      <div className={Styles.Info}>
        <BulbIcon />
        <h3 className={Styles.Text}>{userName} предлагает вам обмен</h3>
      </div>
      {type === 'withButton' && (
        <Button variant="ghost" className={Styles.Button} onClick={onClickButton}>
          <span>Перейти</span>
        </Button>
      )}
    </div>
  )
}
