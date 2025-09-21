import styles from './Kanban.module.css';

export default function AtividadeCard({ atividade, onEdit, onDelete, onDragStart }) {
  return (
    <div
      className={styles.card}
      draggable="true"
      onDragStart={(e) => onDragStart(e, atividade.AtividadeId)}
    >
      <p className={styles.categoria}>{atividade.categoria}</p>
      <p>{atividade.descricao}</p>
      <div className={styles.actions}>
        <button onClick={() => onEdit(atividade)}>✏️ Editar</button>
        <button onClick={() => onDelete(atividade.AtividadeId)}>🗑️ Excluir</button>
      </div>
    </div>
  );
}
