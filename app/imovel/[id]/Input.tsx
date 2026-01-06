import { ChangeEvent, useState } from 'react';
import styles from './page.module.css';

interface InputProps {
  type?: 'text' | 'tel' | 'email' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  label?: string;
  name?: string;
  required?: boolean;
}

const formatPhone = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');

  // Aplica a máscara conforme o tamanho
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    // Celular com 9 dígitos
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

export default function Input({
  type = 'text',
  placeholder,
  defaultValue,
  label,
  name,
  required = false,
}: InputProps) {
  const [phoneValue, setPhoneValue] = useState(defaultValue || '');

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhoneValue(formatted);
  };

  if (type === 'textarea') {
    return (
      <div className={styles.formGroup}>
        {label && <label className={styles.formLabel}>{label}</label>}
        <textarea
          className={styles.formTextarea}
          placeholder={placeholder}
          defaultValue={defaultValue}
          name={name}
          required={required}
        />
      </div>
    );
  }

  if (type === 'tel') {
    return (
      <div className={styles.formGroup}>
        {label && <label className={styles.formLabel}>{label}</label>}
        <input
          type="tel"
          className={styles.formInput}
          placeholder={placeholder}
          value={phoneValue}
          onChange={handlePhoneChange}
          name={name}
          required={required}
          maxLength={15}
        />
      </div>
    );
  }

  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.formLabel}>{label}</label>}
      <input
        type={type}
        className={styles.formInput}
        placeholder={placeholder}
        defaultValue={defaultValue}
        name={name}
        required={required}
      />
    </div>
  );
}
