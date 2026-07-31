import Styles from './PopUp.module.css'
import { BulbIcon, CloseIcon } from '@/shared/ui'
import { PopUpProps } from '@/shared/ui/PopUp/types.ts'

export const PopUp = ({ userName, type = 'withoutButton', onClickClose, onClickButton }: PopUpProps) => {
  return (
    <div className={Styles.Wrapper}>
      <button onClick={onClickClose} className={Styles.Close}>
        <CloseIcon />
      </button>
      <div className={Styles.Info}>
        <BulbIcon size={24} />
        <h3 className={Styles.Text}>{userName} предлагает вам обмен</h3>
      </div>
      {type === 'withButton' && (
        <button className={Styles.Button} onClick={onClickButton}>
          <span>Перейти</span>
        </button>
      )}
    </div>
  )
}
