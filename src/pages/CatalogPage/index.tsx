// TODO: реализовать страницу CatalogPage

/*export default function CatalogPage() {
  return (
    <main>
      <h1>CatalogPage</h1>
      <p>Страница в разработке</p>
    </main>
  )
}*/

import { Header } from '@/widgets/Header';



export default function CatalogPage() {
  return (
    <>
      <Header variant="loggedOut" />

      <hr />

      <Header variant="loggedIn" />

      <hr />

      <Header variant="pure" />
    </>
  );
}
