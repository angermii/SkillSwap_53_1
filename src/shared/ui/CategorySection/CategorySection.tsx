import Styles from './CategorySection.module.css'
import { CategorySectionProps } from './types'

export const CategorySection = ({
  icon,
  iconColor,
  category,
  subCategories,
  onClick,
}: CategorySectionProps) => {
  return (
    <div className={Styles.CategoryWrapper}>
      <div className={`${Styles.IconWrapper} ${Styles[iconColor]}`}>{icon}</div>
      <div className={Styles.Section}>
        <h2 className={Styles.Category}>{category}</h2>
        <ul className={Styles.SubList}>
          {subCategories &&
            subCategories.map((subCat) => (
              <li className={Styles.SubCat} key={subCat}>
                <button className={Styles.SubButton} onClick={() => onClick?.(subCat)}>
                  {subCat}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
