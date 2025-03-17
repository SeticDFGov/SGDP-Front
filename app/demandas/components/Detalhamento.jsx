import React from "react";
import { createDetalhe, getAllDetalhes } from "../services/detalheSerive";
import { useState, useEffect } from "react";

const DemandDetailsModal = ({ isOpen, onClose, demandaId , item}) => {
  const [detailData, setDetailData] = useState([]);
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState(""); // Estado para o novo detalhamento
  const [isAddingDetail, setIsAddingDetail] = useState(false); // Controle de exibição do campo de detalhamento
 const [sendDetail, setSendDetail] = useState(null)

  useEffect(() => {
    if (isOpen) {
      // Chamada para a API
      const fetchDemandDetails = async () => {
        try {
          const response = await getAllDetalhes(demandaId);
          console.log(response);
          setDetailData(response);  // Atualiza o estado com os dados da demanda
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      };

      fetchDemandDetails();
    }
  }, [isOpen, demandaId]); // Dependências: chamada sempre que o modal for aberto e houver demandaId

  if (!isOpen) return null;

const handleAddDetail = async () => {
  if (newDetail.trim()) {
    const newDetailEntry = { NM_DEMANDA: demandaId, DETALHAMENTO: newDetail };

    // Garante que sendDetail seja um array antes de atualizar
    setSendDetail((prevDetails) => [...(prevDetails || []), newDetailEntry]);

    try {
      await createDetalhe(newDetailEntry); // Envia apenas o novo detalhamento
      setNewDetail(""); // Limpa o campo após a adição
      setIsAddingDetail(false); // Fecha o campo de entrada
      window.location.reload()
    } catch (error) {
      console.error("Erro ao criar detalhamento:", error);
    }
  } else {
    alert("Por favor, insira um detalhamento.");
  }
};



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          Detalhes
          {/* Botão de adicionar novo detalhamento */}
          <button
            onClick={() => setIsAddingDetail(true)} // Exibe o campo de input
            className="text-white bg-blue-500 rounded-full p-2 hover:bg-blue-600 focus:outline-none"
          >
            <span className="material-icons">add</span>
          </button>
        </h2>

        {/* Campo de input para novo detalhamento */}
        {isAddingDetail && (
          <div className="mb-4">
            <textarea
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)} // Atualiza o estado com o valor do campo
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              placeholder="Digite o novo detalhamento"
            />
            <button
              onClick={handleAddDetail}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Adicionar Detalhamento
            </button>
            <button
              onClick={() => setIsAddingDetail(false)} // Fecha o campo de input
              className="mt-2 ml-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {/* Histórico de detalhamentos */}
          <div className="col-span-1 border-r pr-4">
            <h3 className="font-semibold mb-2">Histórico de detalhamentos</h3>
            <div className="border-l-2 border-gray-300 pl-4">
              {detailData.map((item) => (
                <div key={item.ID} className="mb-4">
                  <p className="text-sm font-bold">
                    {(() => {
                      try {
                        const data = new Date(item.Created);
                        if (isNaN(data)) throw new Error("Data inválida");
                        return data.toLocaleDateString("pt-BR");
                      } catch {
                        return "";
                      }
                    })()}
                  </p>
                  <p className="text-sm">{item.DETALHAMENTO}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Informações da demanda */}
          <div className="col-span-2 bg-gray-100 p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nome</p>
                <p>{item.NM_DEMANDA}</p>
              </div>
              <div>
                <p className="font-semibold">Data de Solicitação</p>
                <p>{
                                         (() => {
                                    try {
                                    const data = new Date(item.DT_SOLICITACAO);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()
                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Data de Abertura</p>
                <p>{
                                         (() => {
                                    try {
                                    const data = new Date(item.DT_ABERTURA);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()
                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Data de Conclusão</p>
                <p>{
                                         (() => {
                                    try {
                                    const data = new Date(item.DT_CONCLUSAO);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()
                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{item.STATUS}</p>
              </div>
              <div>
                <p className="font-semibold">Unidade</p>
                <p>{item.UNIDADE}</p>
              </div>
              <div>
                <p className="font-semibold">Responsável</p>
                <p>{item.PO_SUBTDCR}</p>
              </div>
              <div>
                <p className="font-semibold">Área Demandante</p>
                <p>{item.NM_AREA_DEMANDANTE}</p>
              </div>
              <div>
                <p className="font-semibold">Demandante</p>
                <p>{item.NM_PO_DEMANDANTE}</p>
              </div>
              
              <div>
                <p className="font-semibold">Nº Processo SEI</p>
                <p>{item.NR_PROCESSO_SEI}</p>
              </div>
              <div>
                <p className="font-semibold">Periódico</p>
                <p>{item.PERIODICO}</p>
              </div>
              <div>
                <p className="font-semibold">Periodicidade</p>
                <p>{item.PERIODICIDADE}</p>
              </div>
              <div>
                <p className="font-semibold">Patrocinador</p>
                <p>{item.PATROCINADOR}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de fechar */}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="border border-black px-4 py-2 rounded">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandDetailsModal;
