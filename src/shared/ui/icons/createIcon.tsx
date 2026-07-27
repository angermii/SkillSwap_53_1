import type { ComponentType, SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export const createIcon = (SvgComponent: SvgComponent) => {
  return function Icon({ size = 24, width, height, ...props }: IconProps) {
    return <SvgComponent {...props} width={width ?? size} height={height ?? size} />
  }
}
