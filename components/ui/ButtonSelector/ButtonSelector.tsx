'use client';

import styles from './ButtonSelector.module.css';

export interface ButtonSelectorOption {
  value: string;
  label: string;
}

interface ButtonSelectorProps {
  options: ButtonSelectorOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  allowDeselect?: boolean;
}

export function ButtonSelector({
  options,
  value,
  onChange,
  label,
  className,
  allowDeselect = true,
}: ButtonSelectorProps) {
  const handleClick = (optionValue: string) => {
    if (allowDeselect && value === optionValue) {
      onChange('');
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.buttonGroup}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.button} ${value === option.value ? styles.buttonActive : ''}`}
            onClick={() => handleClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
