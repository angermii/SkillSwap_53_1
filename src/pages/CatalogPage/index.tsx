import { SkillInfo, Button, EditIcon } from '@/shared/ui'

export default function CatalogPage() {
  return (
    <main style={{ padding: '40px', backgroundColor: '#F9FAF7', minHeight: '100vh' }}>
      
      {/* Наш подопытный компонент */}
      <SkillInfo 
        title="Игра на барабанах"
        subtitle="Творчество и искусство / Музыка и звук"
        description="Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры."
      >
        <Button variant="secondary" startIcon={<EditIcon />}>Редактировать</Button>
        <Button variant="primary">Готово</Button>
      </SkillInfo>

    </main>
  )
}