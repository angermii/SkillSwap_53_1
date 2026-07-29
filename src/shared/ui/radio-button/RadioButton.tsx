import React from 'react';

import RadiobuttonActiveIcon from '../icons/RadiobuttonActiveIcon.svg';
import RadiobuttonEmptyIcon from '../icons/RadiobuttonEmptyIcon.svg';

import styles from './RadioButton.module.css';

export type RadioButtonProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label: string;
};

export const RadioButton = ({
  label,
  checked,
  ...props
}: RadioButtonProps) => {
  const icon = checked
    ? RadiobuttonActiveIcon
    : RadiobuttonEmptyIcon;

  return (
    <label className={styles.label}>
      <input
        {...props}
        type="radio"
        className={styles.input}
        checked={checked}
      />

      <img
        src={icon}
        alt=""
        className={styles.icon}
        aria-hidden="true"
      />

      <span className={styles.text}>{label}</span>
    </label>
  );
};
