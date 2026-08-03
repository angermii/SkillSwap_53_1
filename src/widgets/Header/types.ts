export type HeaderVariant =
  | 'loggedOut'
  | 'loggedIn'
  | 'pure';

export type HeaderProps = {
  variant?: 'loggedOut' | 'loggedIn' | 'pure';
  user?: {
    name: string;
    avatarSrc?: string | null;
  };
};
