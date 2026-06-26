import React, { useState, useEffect } from 'react';
import { createAttendance } from '../services/api';

interface CreateAttendanceFormProps {
  onSuccess: () => void;
}

export default function CreateAttendanceForm({ onSuccess }: CreateAttendanceFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [subjectOption, setSubjectOption] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validate inputs
    const finalSubject = subjectOption === 'Outro' ? customSubject.trim() : subjectOption;

    if (!customerName.trim()) {
      setError('O nome do cliente é obrigatório.');
      return;
    }

    if (!finalSubject) {
      setError('O assunto é obrigatório.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createAttendance({
        customerName: customerName.trim(),
        subject: finalSubject,
      });

      setSuccessMessage('Atendimento criado com sucesso!');
      setCustomerName('');
      setSubjectOption('');
      setCustomSubject('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar atendimento.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    customerName.trim().length > 0 &&
    (subjectOption === 'Outro' ? customSubject.trim().length > 0 : subjectOption.length > 0);

  return (
    <div className="create-attendance-card">
      <h3 className="card-title">Novo Atendimento</h3>
      <form onSubmit={handleSubmit} className="create-attendance-form">
        <div className="form-group">
          <label htmlFor="customerName" className="form-label">
            Nome do Cliente
          </label>
          <input
            id="customerName"
            type="text"
            className="form-input"
            placeholder="Ex: Maria Silva"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Assunto
          </label>
          <select
            id="subject"
            className="form-select"
            value={subjectOption}
            onChange={(e) => {
              setSubjectOption(e.target.value);
              if (e.target.value !== 'Outro') {
                setCustomSubject('');
              }
            }}
            disabled={submitting}
          >
            <option value="">Selecione um assunto...</option>
            <option value="Problemas com cartão">Problemas com cartão</option>
            <option value="Contratação de empréstimo">Contratação de empréstimo</option>
            <option value="Outro">Outro assunto livre...</option>
          </select>
        </div>

        {subjectOption === 'Outro' && (
          <div className="form-group animate-slide-down">
            <label htmlFor="customSubject" className="form-label">
              Especificar Assunto
            </label>
            <input
              id="customSubject"
              type="text"
              className="form-input"
              placeholder="Digite o assunto livre"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              disabled={submitting}
            />
          </div>
        )}

        {error && <div className="form-error">{error}</div>}
        {successMessage && <div className="form-success">{successMessage}</div>}

        <button
          type="submit"
          className="btn-submit"
          disabled={submitting || !isFormValid}
        >
          {submitting ? 'Criando... 🔄' : 'Criar Atendimento ➕'}
        </button>
      </form>
    </div>
  );
}
