import { useState, useEffect } from "react";
import {useApi } from "../services/analiseService";
import { useAnaliseApi } from "../hooks/analiseHook";

export const AnaliseModal = ({ isOpen, onClose, nomeProjeto }) => {
  const { getLastAnalise, createItem } = useAnaliseApi();
  const [atividades, setAtividades] = useState([
        { id: 1, categoria: '', descricao: '', dataInicio: '', dataTermino: '' }
    ]);

    const handleAtividadeChange = (index, event) => {
        // Cria uma cópia do array de atividades
        const novasAtividades = [...atividades];
        // Atualiza o valor do campo específico na atividade correta
        novasAtividades[index][event.target.name] = event.target.value;
        // Define o novo estado
        setAtividades(novasAtividades);
    };

    const adicionarAtividade = () => {
        const novaAtividade = {
            // Usar um ID único é importante para o React e para a remoção
            id: Date.now(),
            categoria: '',
            descricao: '',
            dataInicio: '',
            dataTermino: ''
        };
        setAtividades([...atividades, novaAtividade]);
    };

    const removerAtividade = (id) => {
        // Filtra o array, mantendo apenas as atividades com ID diferente
        const novasAtividades = atividades.filter((atividade) => atividade.id !== id);
        setAtividades(novasAtividades);
    };

    const [formData, setFormData] = useState({
    NM_PROJETO: Number(nomeProjeto) || 0,
    ANALISE: "",
    ENTRAVE: ""
  });

  const [lastAnalise, setLastAnalise] = useState(null);

  useEffect(() => {
    if (isOpen && nomeProjeto) {
      fetchLastAnalise();
    }
  }, [isOpen, nomeProjeto]);

  const fetchLastAnalise = async () => {
    const data = await getLastAnalise(Number(nomeProjeto));
    if (data) {
      setLastAnalise(data);
      setFormData((prev) => ({
        ...prev,
        NM_PROJETO: Number(nomeProjeto),
        ANALISE: "",
        ENTRAVE: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "ENTRAVE" ? value === "true" : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      NM_PROJETO: Number(formData.NM_PROJETO),
    };

    const response = await createItem(dataToSend, formData.NM_PROJETO); // 🔹 envia ID
    if (response) {
      alert("Análise salva com sucesso!");
      window.location.reload(); // ou uma abordagem mais controlada
      onClose();
    }
  };
  return (
  isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[700px] h-auto max-h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Novo Report</h2>

        

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              name="ANALISE"
              value={formData.ANALISE}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-y"
              placeholder="Digite a análise aqui..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fase</label>
            <select
              name="ENTRAVE"
              value={formData.ENTRAVE.toString()}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Selecione fase</option>
              <option value="true">Planejamento</option>
              <option value="false">Execução</option>
            </select>
          </div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Atividades do Projeto</h3>

                <h4 className="text-lg font-medium text-gray-800">Em Andamento</h4>
                <button
                    type="button"
                    onClick={adicionarAtividade}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Adicionar Atividade
                </button>
            </div> 
            {/* Mapeia o array de atividades para renderizar cada linha de input */}
            {atividades.map((atividade, index) => (
                <div key={atividade.id} className="flex flex-col md:flex-row md:items-end gap-4 mb-4 p-4 border rounded-lg bg-white">

                    <div className="flex-grow">
                        <label htmlFor={`categoria-${atividade.id}`} className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <input
                            type="text"
                            id={`categoria-${atividade.id}`}
                            name="categoria"
                            value={atividade.categoria}
                            onChange={(e) => handleAtividadeChange(index, e)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Ex: Análise"
                        />
                    </div>

                    <div className="w-full md:w-2/5">
                        <label htmlFor={`descricao-${atividade.id}`} className="block text-sm font-medium text-gray-700 mb-1">Descrição da Atividade</label>
                        <input
                            type="text"
                            id={`descricao-${atividade.id}`}
                            name="descricao"
                            value={atividade.descricao}
                            onChange={(e) => handleAtividadeChange(index, e)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                            placeholder="Ex: Levantar requisitos do sistema"
                        />
                    </div>

                    <div className="flex-grow">
                        <label htmlFor={`dataTermino-${atividade.id}`} className="block text-sm font-medium text-gray-700 mb-1">Data Término</label>
                        <input
                            type="date"
                            id={`dataTermino-${atividade.id}`}
                            name="dataTermino"
                            value={atividade.dataTermino}
                            onChange={(e) => handleAtividadeChange(index, e)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => removerAtividade(atividade.id)}
                            className="h-10 w-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
                            aria-label="Remover Atividade"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
      
    <div>
            <label className="block text-sm font-medium mb-1">Entrave</label>
            <select
              name="ENTRAVE"
              value={formData.ENTRAVE.toString()}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Selecione um entrave</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>      
    <div className="w-full flex justify-center gap-4 pt-6 border-t border-gray-200 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
);

}
export default AnaliseModal;
