'use client';

import { FormEvent, useState } from 'react';
import styles from './AnunciarForm.module.css';

export function AnunciarForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      // TODO: Implement actual form submission logic
      console.log('Form data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Erro ao enviar formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              required
            />
          </div>
          <div className={styles.formFieldSmall}>
            <input
              type="text"
              name="bairro"
              placeholder="Bairro"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formFieldSmall}>
            <input
              type="text"
              name="cidade"
              placeholder="Cidade"
              className={styles.input}
              required
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formFieldLarge}>
            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              className={styles.input}
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
              placeholder="Descrição do imóvel"
              className={styles.textarea}
              rows={4}
              required
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
  );
}
