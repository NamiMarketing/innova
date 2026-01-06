'use client';

import { FormEvent, useState, ChangeEvent } from 'react';
import { Toast } from '@/components/Toast/Toast';
import styles from './AnunciarForm.module.css';

interface AnunciarFormProps {
  formsparkId?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

export function AnunciarForm({ formsparkId = 'aFXP34E0e' }: AnunciarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastState['type']) => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const formatCep = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);

    const numbers = formatted.replace(/\D/g, '');
    if (numbers.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${numbers}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setEndereco(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
        } else {
          showToast('CEP não encontrado.', 'error');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showToast('Erro ao buscar CEP. Tente novamente.', 'error');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`https://submit-form.com/${formsparkId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status >= 200 && response.status < 300) {
        showToast(
          'Formulário enviado com sucesso! Entraremos em contato em breve.',
          'success'
        );
        form.reset();
        setTelefone('');
        setCep('');
        setEndereco('');
        setBairro('');
        setCidade('');
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast(
        'Erro ao enviar formulário. Por favor, tente novamente.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Personal Data */}
        <div className={styles.formGroup}>
          <h3 className={styles.formGroupTitle}>Dados pessoais</h3>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formField}>
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formField}>
              <input
                type="tel"
                name="telefone"
                placeholder="Telefone"
                className={styles.input}
                value={telefone}
                onChange={handlePhoneChange}
                maxLength={15}
                required
              />
            </div>
          </div>
        </div>

        {/* Property Data */}
        <div className={styles.formGroup}>
          <h3 className={styles.formGroupTitle}>Dados do imóvel</h3>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <select name="finalidade" className={styles.select} required>
                <option value="">Selecione a finalidade</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>
            <div className={styles.formField}>
              <select name="tipo" className={styles.select} required>
                <option value="">Selecione o tipo de imóvel</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="comercial">Comercial</option>
                <option value="terreno">Terreno</option>
                <option value="na-planta">Na Planta</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formFieldSmall}>
              <input
                type="text"
                name="cep"
                placeholder="CEP"
                className={styles.input}
                value={cep}
                onChange={handleCepChange}
                maxLength={9}
                required
              />
            </div>
            <div className={styles.formFieldSmall}>
              <input
                type="text"
                name="bairro"
                placeholder={loadingCep ? 'Buscando...' : 'Bairro'}
                className={styles.input}
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                required
              />
            </div>
            <div className={styles.formFieldSmall}>
              <input
                type="text"
                name="cidade"
                placeholder={loadingCep ? 'Buscando...' : 'Cidade'}
                className={styles.input}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formFieldLarge}>
              <input
                type="text"
                name="endereco"
                placeholder={loadingCep ? 'Buscando...' : 'Endereço'}
                className={styles.input}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </div>
            <div className={styles.formFieldSmall}>
              <input
                type="text"
                name="numero"
                placeholder="Número"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formFieldSmall}>
              <input
                type="text"
                name="complemento"
                placeholder="Complemento"
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <textarea
                name="descricao"
                placeholder="Descrição do imóvel (opcional)"
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </>
  );
}
