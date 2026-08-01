export type HeaderVariant =
  | 'loggedOut'
  | 'loggedIn'
  | 'pure';

export type HeaderProps = {
  variant?: HeaderVariant;
};
