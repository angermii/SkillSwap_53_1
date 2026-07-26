import React from 'react';

import styles from './RadioButton.module.css';

export interface RadioButtonProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export const RadioButton = ({
  checked,
  onChange,
  label,
}: RadioButtonProps) => {
  return (
    <label className={styles.label}>
      <input
        type="radio"
        className={styles.input}
        checked={checked}
        onChange={onChange}
      />

      <span className={styles.radio} />

      <span className={styles.text}>{label}</span>
    </label>
  );
};
