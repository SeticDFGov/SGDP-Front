import { useState, useEffect } from 'react';
import styles from './Kanban.module.css';

export default function AtividadeModal({ atividade, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({ categoria: '', descricao: '', data_fim: '' });

  useEffect(() => {
    if (atividade) {
      // Formata a data para o formato YYYY-MM-DD que o input[type=date] espera
      const formattedDate = atividade.dataTermino ? new Date(atividade.dataTermino).toISOString().split('T')[0] : '';
      setFormData({
        categoria: atividade.categoria || '',
        descricao: atividade.descricao || '',
        data_fim: formattedDate,
      });
    } else {
      setFormData({ categoria: '', descricao: '', data_fim: '' });
    }
  }, [atividade, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = atividade ? { ...atividade, ...formData } : formData;
    onSave(dataToSave);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{atividade ? 'Editar Atividade' : 'Nova Atividade'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Categoria"
            required
          />
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descrição da atividade"
            required
          />
          <input
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
            required
          />
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
