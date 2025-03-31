import { useState, useEffect } from "react";
import { createItem, getLastAnalise } from "../services/analiseService";

export const AnaliseModal = ({ isOpen, onClose, nomeProjeto }) => {
  const [formData, setFormData] = useState({
   NM_PROJETO:nomeProjeto,
    ANALISE: "",
    ENTRAVE: false
  });
  const [lastAnalise, setLastAnalise] = useState(null);

  useEffect(() => {
    if (isOpen && nomeProjeto) {
      fetchLastAnalise();
    }
  }, [isOpen, nomeProjeto]);

  const fetchLastAnalise = async () => {
    const data = await getLastAnalise(nomeProjeto);
    if (data) {
      setLastAnalise(data);
      setFormData({ ANALISE: "", ENTRAVE: "Nao" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(nomeProjeto);
    const response = await createItem({ ...formData }, nomeProjeto);
    if (response) {
      alert("Análise salva com sucesso!");
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md w-[600px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Nova Análise</h2>
          <div className="border-b pb-4 mb-4">
            <h3 className="text-sm font-medium">Última Análise</h3>
            <p className="text-gray-700 text-sm">{lastAnalise?.ANALISE || "Nenhuma análise encontrada"}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nova Análise</label>
              <textarea
                name="ANALISE"
                value={formData.ANALISE}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md resize-y"
                placeholder="Digite a análise aqui..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Entrave</label>
              <select
                name="ENTRAVE"
                value={formData.ENTRAVE}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AnaliseModal;
