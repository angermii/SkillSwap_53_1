import { useEffect } from 'react'

import { fetchSkillByUserId } from '@/entities/skill/model/skillSlice'
import {
  selectSkillSubcategoryById,
  selectSkillsError,
  selectSkillsLoading,
} from '@/entities/skill/model/selectors'
import { Button } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { UserSkillWidget } from '@/widgets/UserSkillWidget'

export function ProfileSkills() {
  const dispatch = useAppDispatch()

  const authUser = useAppSelector((state) => state.auth.user)
  const skills = useAppSelector((state) => state.skill.skills)

  const loading = useAppSelector(selectSkillsLoading)
  const error = useAppSelector(selectSkillsError)

  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchSkillByUserId(authUser.id))
    }
  }, [authUser?.id, dispatch])

  const skill = skills[0]

  const subcategory = useAppSelector((state) =>
    selectSkillSubcategoryById(state, skill?.subcategoryId ?? ''),
  )

  if (loading) {
    return <p>Загрузка навыка...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!skill) {
    return <p>У вас пока нет навыков.</p>
  }

  const images = (skill.imageUrl ?? []).map((src, index) => ({
    id: `${skill.id}-image-${index}`,
    src,
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