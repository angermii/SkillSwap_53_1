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
