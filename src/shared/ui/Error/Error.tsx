import Styles from './Error.module.css'
import { ReactNode } from 'react'

export interface ErrorProps {
  errorImg?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title?: string
  description?: string
  children?: ReactNode
  imageWidth?: number
  imageHeight?: number
}

export const Error = ({
  errorImg: SvgComponent,
  title,
  description,
  children,
  imageHeight,
  imageWidth,
}: ErrorProps) => {
  return (
    <div className={Styles.errorWrapper}>
      <div className={Styles.imgWrapper}>
        {SvgComponent && <SvgComponent width={imageWidth} height={imageHeight} />}{' '}
      </div>
      <div className={Styles.info}>
        <div className={Styles.textWrapper}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className={Styles.buttons}>{children}</div>
      </div>
    </div>
  )
}
