import { selectSkillSubcategoryById } from '@/entities/skill/model/selectors'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/store/hooks'
import { UserSkillWidget } from '@/widgets/UserSkillWidget'
import { getAuthUserSkills } from '@/shared/lib/authUserMapper'
import { publicAssetUrl } from '@/shared/lib/helpers'

export function ProfileSkills() {
  const authUser = useAppSelector((state) => state.auth.user)
  const skill = authUser
    ? getAuthUserSkills(authUser).find((item) => item.type === 'teach')
    : undefined

  const subcategory = useAppSelector((state) =>
    selectSkillSubcategoryById(state, skill?.subcategoryId ?? ''),
  )

  if (!skill) {
    return <p>У вас пока нет навыков.</p>
  }

  const images = (skill.imageUrl ?? []).map((src, index) => ({
    id: `${skill.id}-image-${index}`,
    src: publicAssetUrl(src) ?? src,
    alt: `${skill.title} — изображение ${index + 1}`,
  }))

  return (
    <UserSkillWidget
      skill={{
        title: skill.title,
        subtitle: subcategory?.title ?? 'Без категории',
        description: skill.description,
      }}
      gallery={{
        images,
      }}
      actions={
        <Button
          variant="secondary"
          onClick={() => {
            // TODO: реализовать редактирование навыка
          }}
        >
          Редактировать описание
        </Button>
      }
    />
  )
}
