import styles from './page.module.css';

interface InputProps {
  type?: 'text' | 'tel' | 'email' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  label?: string;
}

export default function Input({ type = 'text', placeholder, defaultValue, label }: InputProps) {
  if (type === 'textarea') {
    return (
      <div className={styles.formGroup}>
        {label && <label className={styles.formLabel}>{label}</label>}
        <textarea
          className={styles.formTextarea}
          placeholder={placeholder}
          defaultValue={defaultValue}
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
      />
    </div>
  );
}
