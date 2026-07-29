import React from 'react';

import {
  RadiobuttonActiveIcon,
  RadiobuttonEmptyIcon,
} from '../icons';

import styles from './RadioButton.module.css';

export interface RadioButtonProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value: string;
}

export const RadioButton = ({
  checked,
  onChange,
  label,
  value,
}: RadioButtonProps) => {
  const Icon = checked
    ? RadiobuttonActiveIcon
    : RadiobuttonEmptyIcon;

  return (
    <label className={styles.label}>
      <input
        type="radio"
        className={styles.input}
        checked={checked}
        value={value}
        onChange={onChange}
      />

      <Icon
        className={`${styles.icon} ${
          checked ? styles.active : ''
        }`}
        aria-hidden="true"
      />

      <span className={styles.text}>{label}</span>
    </label>
  );
};
