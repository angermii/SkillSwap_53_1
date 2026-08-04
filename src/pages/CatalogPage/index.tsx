import { FiltersBar } from '@/widgets';

export default function CatalogPage() {
return (
    <main style={{ padding: '40px', backgroundColor: '#F9FAF7', minHeight: '100vh', display: 'flex', gap: '20px' }}>

     {/* Выводим наш новый виджет */}
      <FiltersBar />

     {/* Здесь в будущем будет сетка с карточками навыков */}
      <div>Тут будут карточки...</div>

   </main>
 );
}
