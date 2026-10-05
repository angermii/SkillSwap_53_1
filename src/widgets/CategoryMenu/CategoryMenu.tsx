import Styles from './CategoryMenu.module.css'
import { CategorySection, CategorySectionProps } from '@/shared/ui'

export interface CategoryMenuProps {
  sections: CategorySectionProps[]
  onClick?: () => void
}

export const CategoryMenu = ({ sections, onClick }: CategoryMenuProps) => {
  return (
    <div className={Styles.Wrapper}>
      {sections.map((section, index) => (
        <CategorySection
          key={index}
          icon={section.icon}
          iconColor={section.iconColor}
          category={section.category}
          subCategories={section.subCategories}
          onClick={onClick}
        />
      ))}
    </div>
  )
}
