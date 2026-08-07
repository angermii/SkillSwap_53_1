import { Header } from '@/widgets/Header'
import { AppleIcon } from '@/shared/ui/icons'
import type { CategorySectionProps } from '@/shared/ui'

const categorySections: CategorySectionProps[] = [
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Бизнес и карьера',
    subCategories: [
      'Управление командой',
      'Маркетинг и реклама',
      'Продажи и переговоры',
    ],
  },
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Иностранные языки',
    subCategories: [
      'Английский',
      'Французский',
      'Испанский',
    ],
  },
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Дом и уют',
    subCategories: [
      'Уборка и организация',
      'Приготовление еды',
      'Домашние растения',
    ],
  },
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Творчество и искусство',
    subCategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Музыка и звук',
    ],
  },
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Образование и развитие',
    subCategories: [
      'Личностное развитие',
      'Навыки обучения',
      'Коучинг',
    ],
  },
  {
    icon: <AppleIcon />,
    iconColor: 'yellow',
    category: 'Здоровье и лайфстайл',
    subCategories: [
      'Йога и медитация',
      'Питание и ЗОЖ',
      'Физические тренировки',
    ],
  },
]

export default function CatalogPage() {
  return (
    <Header
      variant="loggedOut"
      categorySections={categorySections}
    />
  )
}
