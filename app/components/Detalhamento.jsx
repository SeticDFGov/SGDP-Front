import React from "react";

const DemandDetailsModal = ({ isOpen, onClose, demandData }) => {
  if (!isOpen || !demandData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Detalhes</h2>

        <div className="grid grid-cols-3 gap-4">
          {/* Histórico de detalhamentos */}
          <div className="col-span-1 border-r pr-4">
            <h3 className="font-semibold mb-2">Histórico de detalhamentos</h3>
            <div className="border-l-2 border-gray-300 pl-4">
              {demandData.detalhamentos.map((detalhe, index) => (
                <div key={index} className="mb-4">
                  <p className="text-sm font-bold">{detalhe.data}</p>
                  <p className="text-sm">{detalhe.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Informações da demanda */}
          <div className="col-span-2 bg-gray-100 p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nome</p>
                <p>{demandData.nome}</p>
              </div>
              <div>
                <p className="font-semibold">Data de Solicitação</p>
                <p>{demandData.dataSolicitacao}</p>
              </div>
              <div>
                <p className="font-semibold">Data de Abertura</p>
                <p>{demandData.dataAbertura}</p>
              </div>
              <div>
                <p className="font-semibold">Data de Conclusão</p>
                <p>{demandData.dataConclusao}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{demandData.status}</p>
              </div>
              <div>
                <p className="font-semibold">Unidade</p>
                <p>{demandData.unidade}</p>
              </div>
              <div>
                <p className="font-semibold">Responsável</p>
                <p>{demandData.responsavel}</p>
              </div>
              <div>
                <p className="font-semibold">Demandante</p>
                <p>{demandData.demandante}</p>
              </div>
              <div>
                <p className="font-semibold">Nº Processo SEI</p>
                <p>{demandData.nrProcessoSEI}</p>
              </div>
              <div>
                <p className="font-semibold">Periódico</p>
                <p>{demandData.periodico}</p>
              </div>
              <div>
                <p className="font-semibold">Periodicidade</p>
                <p>{demandData.periodicidade}</p>
              </div>
              <div>
                <p className="font-semibold">Patrocinador</p>
                <p>{demandData.patrocinador}</p>
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
