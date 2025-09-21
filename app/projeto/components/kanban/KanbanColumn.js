import { useState } from 'react';
import styles from './Kanban.module.css';
import AtividadeCard from './AtividadeCard';

export default function KanbanColumn({ title, status, atividades, onEdit, onDelete, onDragStart, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    onDrop(e, status);
    setIsDragOver(false);
  };

  return (
    <div className={styles.kanbanColumn}>
      <h2>{title}</h2>
      <div
        className={`${styles.cardsContainer} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {atividades.map((atividade) => (
          <AtividadeCard
            key={atividade.AtividadeId}
            atividade={atividade}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}
