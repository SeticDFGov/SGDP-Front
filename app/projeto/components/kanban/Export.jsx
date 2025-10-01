// src/components/ExportManager.js (Não precisa mais da pasta extra)
import { useState, useEffect, useCallback } from 'react';

// Defina a URL base da sua API em um único lugar
const API_BASE_URL = 'http://localhost:5148/api/atividades/export';

export default function ExportManager({ projectId }) {
  const [exports, setExports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [reportId, setReportId] = useState({});
  const fetchExports = useCallback(async () => {
    if (!projectId) return;
  useEffect(() => {
    const checkReportExists = async () => {
      if (!projectId) {
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/reports/${projectId}`);
        if (response.ok) {
          const report = await response.json();
          if (report && report.ReportId) {
            setReportId(report.ReportId);
          } else {
            console.error("Report data is invalid:", report);
          }
        } else if (response.status === 404) {
          setReportStatus('AUSENTE');
        } else {
          throw new Error('Falha ao verificar o report.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    checkReportExists();
  }, [projectId]);


    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/list/${projectId}`);
      if (!response.ok) {
        throw new Error(`Falha ao buscar exports: ${response.statusText}`);
      }
      const data = await response.json();
      setExports(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchExports();
  }, [fetchExports]);

  const handleCreateExport = async () => {
    if (!reportId) {
      setError("O 'reportId' é necessário para criar um export.");
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/create/${reportId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Falha ao criar o export: ${response.statusText}`);
      }
      await fetchExports();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadExport = (exportId) => {
    const downloadUrl = `${API_BASE_URL}/${exportId}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-slate-50 rounded-lg shadow-lg font-sans">
      <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6">
        Gerenciador de Exports
      </h2>
      
      <div className="mb-6">
        <button 
          onClick={handleCreateExport} 
          disabled={isCreating}
          className="py-3 px-6 text-base font-bold text-white bg-blue-600 rounded-md shadow-sm transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Criando...' : 'Criar Novo Export'}
        </button>
      </div>

      {error && (
        <p className="p-3 my-4 text-red-700 bg-red-100 border border-red-200 rounded-md">
          Erro: {error}
        </p>
      )}
      
      {isLoading && <p className="text-slate-600">A carregar exports...</p>}

      {!isLoading && !error && (
        <div className="flex flex-col gap-4">
          {exports.length > 0 ? (
            exports.map((exp) => (
              <div key={exp.exportId} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-md shadow-sm">
                <div className="text-sm">
                  <p className="text-slate-600 my-1">
                    <strong className="font-semibold text-slate-700">ID do Export:</strong> {exp.exportId}
                  </p>
                  <p className="text-slate-600 my-1">
                    <strong className="font-semibold text-slate-700">Data de Criação:</strong>
                    {' '}
                    {new Date(exp.data_criacao).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button 
                  onClick={() => handleDownloadExport(exp.exportId)}
                  className="py-2 px-4 font-semibold text-white bg-green-600 rounded-md shadow-sm transition-colors hover:bg-green-700"
                >
                  Download
                </button>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-slate-500 bg-slate-100 rounded-md">
              Nenhum export encontrado para este projeto.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
