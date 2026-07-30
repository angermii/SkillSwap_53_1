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
  name: string;
}

export const RadioButton = ({
  checked,
  onChange,
  label,
  value,
  name,
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
        name={name}
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
