import { useState, useEffect, useCallback } from 'react';
import styles from './Kanban.module.css';
import KanbanColumn from './KanbanColumn';
import AtividadeModal from './AtividadeModal';

const API_BASE_URL = 'http://localhost:5148/api'; 

export default function KanbanBoard({ projetoId }) {
  // Novos estados para gerir o fluxo do report
  const [reportStatus, setReportStatus] = useState('VERIFICANDO'); // VERIFICANDO | AUSENTE | EXISTENTE | CRIANDO
  const [reportId, setReportId] = useState(null);
  const [newReportData, setNewReportData] = useState({ descricao: '', fase: '' });

  // Estados antigos do Kanban
  const [atividades, setAtividades] = useState([]);
  const [loadingAtividades, setLoadingAtividades] = useState(true);
  const [draggedAtividadeId, setDraggedAtividadeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(null);

  // 1. Função para verificar se o report existe
  const checkReportExists = useCallback(async () => {
    if (!projetoId) return;
    setReportStatus('VERIFICANDO');
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${projetoId}`);
      if (response.ok) {
        const report = await response.json();
        setReportId(report.reportId); // Assumindo que a API retorna o report com seu ID
        setReportStatus('EXISTENTE');
      } else if (response.status === 404) {
        setReportStatus('AUSENTE');
      } else {
        throw new Error('Falha ao verificar o report.');
      }
    } catch (error) {
      console.error(error);
    }
  }, [projetoId]);

  useEffect(() => {
    checkReportExists();
  }, [checkReportExists]);

  const fetchAtividades = useCallback(async () => {
    if (!reportId) return;
    setLoadingAtividades(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/atividades`);
      const data = await response.json();
      setAtividades(data);
    } catch (error) {
      console.error("Falha ao buscar atividades", error);
    } finally {
      setLoadingAtividades(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (reportStatus === 'EXISTENTE' && reportId) {
      fetchAtividades();
    }
  }, [reportStatus, reportId, fetchAtividades]);
  
  const handleCreateReport = async (e) => {
    e.preventDefault();
    setReportStatus('CRIANDO');
    
    const body = {
        NM_PROJETO: parseInt(projetoId, 10), // A API espera um número
        descricao: newReportData.descricao,
        fase: newReportData.fase,
        data_fim: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // Ex: Data de fim daqui a 1 mês
    };

    try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error("Falha ao criar o report");
        
        const newReport = await response.json();
        setReportId(newReport.reportId);
        setReportStatus('EXISTENTE');
    } catch(error) {
        console.error(error);
        setReportStatus('AUSENTE'); // Volta para o estado anterior em caso de erro
    }
  };

  const handleNewReportChange = (e) => {
      const { name, value } = e.target;
      setNewReportData(prev => ({...prev, [name]: value}));
  };


  if (reportStatus === 'VERIFICANDO') {
    return <p>A verificar a existência do report...</p>;
  }

  if (reportStatus === 'AUSENTE' || reportStatus === 'CRIANDO') {
    return (
      <div className={styles.initReportContainer}>
        <h2>Report Não Iniciado</h2>
        <p>É necessário iniciar um report para este projeto antes de adicionar atividades.</p>
        <form onSubmit={handleCreateReport} className={styles.initReportForm}>
          <input 
            name="descricao" 
            placeholder="Descrição do Report" 
            value={newReportData.descricao}
            onChange={handleNewReportChange}
            required 
          />
          <input 
            name="fase" 
            placeholder="Fase Inicial" 
            value={newReportData.fase}
            onChange={handleNewReportChange}
            required 
          />
          <button type="submit" disabled={reportStatus === 'CRIANDO'}>
            {reportStatus === 'CRIANDO' ? 'A criar...' : 'Iniciar Report'}
          </button>
        </form>
      </div>
    );
  }

  if (loadingAtividades) return <p>A carregar atividades...</p>;
  
  const STATUS = { PROXIMO: 'Proximo', ANDAMENTO: 'Andamento', CONCLUIDO: 'Concluido' };

  return (
    <>
      <button className={styles.addTaskBtn} onClick={() => handleOpenModal()}>+ Adicionar Atividade</button>
      <div id="kanban-board" className={styles.kanbanBoard}>
       
      <div id="kanban-board" className={styles.kanbanBoard}>
        <KanbanColumn
          title="Próximo"
          status={STATUS.PROXIMO}
          atividades={atividades.filter(a => a.situacao === STATUS.PROXIMO)}
          onEdit={handleOpenModal} onDelete={handleDelete} onDragStart={handleDragStart} onDrop={handleDrop}
        />
        <KanbanColumn
          title="Em Andamento"
          status={STATUS.ANDAMENTO}
          atividades={atividades.filter(a => a.situacao === STATUS.ANDAMENTO)}
          onEdit={handleOpenModal} onDelete={handleDelete} onDragStart={handleDragStart} onDrop={handleDrop}
        />
        <KanbanColumn
          title="Concluído"
          status={STATUS.CONCLUIDO}
          atividades={atividades.filter(a => a.situacao === STATUS.CONCLUIDO)}
          onEdit={handleOpenModal} onDelete={handleDelete} onDragStart={handleDragStart} onDrop={handleDrop}
        />
      </div>
      <AtividadeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAtividade}
        atividade={editingAtividade}
      />

      </div>
    </>
  );
}
