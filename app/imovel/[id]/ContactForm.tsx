'use client';

import { FormEvent, useState } from 'react';
import { Toast } from '@/components/Toast/Toast';
import Input from './Input';
import styles from './page.module.css';

interface ContactFormProps {
  propertyCode: string;
  whatsappLink: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ContactForm({
  propertyCode,
  whatsappLink,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });
  const defaultMessage = `Olá, gostaria de mais informações sobre o imóvel ${propertyCode}.`;

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      propertyCode, // Include property code in submission
    };

    try {
      const response = await fetch('https://submit-form.com/aFXP34E0e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Formspark returns various status codes, check for success
      if (response.status >= 200 && response.status < 300) {
        showToast(
          'Mensagem enviada com sucesso! Entraremos em contato em breve.',
          'success'
        );
        form.reset();
      } else {
        throw new Error(`Erro ao enviar formulário: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast(
        'Erro ao enviar mensagem. Por favor, tente novamente.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.contactCard}>
        <h2 className={styles.contactTitle}>
          Pronto para avançar?
          <br />
          Fale com a gente
        </h2>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <Input type="text" placeholder="Nome" name="nome" required />
          <Input type="tel" placeholder="Telefone" name="telefone" required />
          <Input
            type="textarea"
            defaultValue={defaultMessage}
            name="mensagem"
            required
          />

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <div className={styles.whatsappSection}>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <svg
              className={styles.whatsappIcon}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </>
  );
}
