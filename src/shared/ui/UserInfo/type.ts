import type { HTMLAttributes } from 'react'

export type UserInfoProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  avatarSrc: string
  avatarAlt?: string
  name: string
  city: string
  age: number
}
