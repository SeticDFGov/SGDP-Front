import { useEffect, useState } from "react";
import { getItemById, iniciarEtapa, updateItem } from "../services/etapaService"; // Importando a função correta
import { useEtapaApi } from "../hooks/etapaHook";

export const InicioEtapa = ({ onClose, isOpen, etapa }) => {
  const [formData, setFormData] = useState({
    
    DT_INICIO_PREVISTO: "",
 
    
  });

  const etapaApi = useEtapaApi();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enviar apenas a data de início prevista em formato ISO
    const dataISO = formData.DT_INICIO_PREVISTO ;
    if (!dataISO) {
      alert("Informe a data de início prevista.");
      return;
    }
    const ok = await etapaApi.iniciarEtapa(etapa.EtapaProjetoId, dataISO);
    if (ok) {
      alert("Etapa iniciada com sucesso!");
      onClose();
      window.location.reload();
    } else {
      alert("Erro ao iniciar etapa.");
    }
  };

  return (
  isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[700px] max-h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Iniciar Etapa</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-5 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Data Início Previsto</label>
            <input
              type="date"
              name="DT_INICIO_PREVISTO"
              value={formData.DT_INICIO_PREVISTO}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

       

          <div className="col-span-1 sm:col-span-2 flex justify-center gap-4 pt-6 border-t border-gray-200 mt-2">
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
              Iniciar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
);

};

export default InicioEtapa;
