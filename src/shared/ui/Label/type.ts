// чтобы нельзя было передать какую-то случайную строку вместо цвета
export type LabelColor = 'yellow' | 'blue' | 'green' | 'purple' | 'pink' | 'peach' | 'gray'

export type LabelProps = {
  text: string
  color: LabelColor
}
