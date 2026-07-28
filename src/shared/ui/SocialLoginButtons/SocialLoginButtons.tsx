import { Button } from '../Button';
import { GoogleIcon, AppleIcon } from '../icons';

import styles from './SocialLoginButtons.module.css';

export const SocialLoginButtons = () => {
  const handleGoogleClick = () => {};
  const handleAppleClick = () => {};

  return (
    <div className={styles.container}>
      <Button
        variant="social"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleClick}
      >
        Продолжить с Google
      </Button>

      <Button
        variant="social"
        startIcon={<AppleIcon />}
        onClick={handleAppleClick}
      >
        Продолжить с Apple
      </Button>
    </div>
  );
};
