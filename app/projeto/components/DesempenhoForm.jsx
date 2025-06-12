import { useEffect, useState } from "react";
import { getItemById, updateItem } from "../services/etapaService"; // Importando a função correta

export const DesempenhoForm = ({ onClose, isOpen, etapa }) => {
  const [formData, setFormData] = useState({
    DT_INICIO_REAL: "",
    DT_TERMINO_REAL: "",
    PERCENT_EXEC_ETAPA: "",
    ANALISE: "",
  });


 
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""; 

  return dateString.split("T")[0]; 
  };

  const handleLoadItem = async () => {
    if (!etapa?.EtapaProjetoId) return; 

    const data = await getItemById(etapa.EtapaProjetoId);
    console.log(data)
    if (data) {
      setFormData({
        DT_INICIO_REAL: formatDateForDisplay(data.DT_INICIO_REAL),
        DT_TERMINO_REAL: formatDateForDisplay(data.DT_TERMINO_REAL),
        PERCENT_EXEC_ETAPA: data.PERCENT_EXEC_ETAPA || "",
        ANALISE: data.ANALISE || "",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadItem();
    }
  }, [isOpen, etapa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const emptyToNull = (value) => (value === "" ? null : value);
  const handleSubmit = async (e) => {
    e.preventDefault();

    

  const itemData = {
    DT_INICIO_REAL: emptyToNull(formData.DT_INICIO_REAL) ,
    DT_TERMINO_REAL: emptyToNull(formData.DT_TERMINO_REAL) ,
    PERCENT_EXEC_ETAPA: formData.PERCENT_EXEC_ETAPA,
    ANALISE: formData.ANALISE,
  };
    console.log(itemData) 
   

    await updateItem(etapa.EtapaProjetoId, itemData);
    alert("Etapa analisada com sucesso!");
    onClose();
    window.location.reload();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-xl w-[700px] h-auto max-h-[90vh] overflow-y-auto flex flex-col">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Nova Análise de Empenho</h2>
  
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 text-gray-700">
            <div>
              <label className="block text-sm font-medium mb-1">Data Início Real</label>
              <input
                type="date"
                name="DT_INICIO_REAL"
                value={formData.DT_INICIO_REAL}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Data Término Real</label>
              <input
                type="date"
                name="DT_TERMINO_REAL"
                value={formData.DT_TERMINO_REAL}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Percentual Executado da Etapa</label>
              <input
                type="number"
                name="PERCENT_EXEC_ETAPA"
                value={formData.PERCENT_EXEC_ETAPA}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                min={0}
                max={100}
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Análise da Etapa</label>
              <textarea
                name="ANALISE"
                value={formData.ANALISE}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-y"
                placeholder="Digite a análise aqui..."
              />
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
                Nova Análise
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}  

export default DesempenhoForm;
