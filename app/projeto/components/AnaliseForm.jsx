import { useState, useEffect } from "react";
import {useApi } from "../services/analiseService";
import { useAnaliseApi } from "../hooks/analiseHook";

export const AnaliseModal = ({ isOpen, onClose, nomeProjeto }) => {
  const { getLastAnalise, createItem } = useAnaliseApi(); 

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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Nova Análise</h2>

        <div className="border-b pb-4 mb-6">
          <h3 className="text-sm font-medium text-gray-600">Última Análise</h3>
          <p className="text-gray-700 text-sm">{lastAnalise?.ANALISE || "Nenhuma análise encontrada"}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Nova Análise</label>
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
