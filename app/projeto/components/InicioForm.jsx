import { useEffect, useState } from "react";
import { getItemById, iniciarEtapa, updateItem } from "../services/etapaSevice"; // Importando a função correta

export const InicioEtapa = ({ onClose, isOpen, etapa }) => {
  const [formData, setFormData] = useState({
    EtapaProjetoId : "",
    DT_INICIO_PREVISTO: "",
    DT_TERMINO_PREVISTO: "",
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      EtapaProjetoId : etapa.EtapaProjetoId,
      DT_INICIO_PREVISTO: formData.DT_INICIO_PREVISTO,
      DT_TERMINO_PREVISTO: formData.DT_TERMINO_PREVISTO,
   
    };
    console.log(itemData)

    await iniciarEtapa(itemData);
    alert("Etapa iniciada com sucesso!");
    onClose();
    window.location.reload();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md w-[1200px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Iniciar Etapa</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Data Início Previsto</label>
              <input
                type="date"
                name="DT_INICIO_PREVISTO"
                value={formData.DT_INICIO_PREVISTO}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Data Término Previsto</label>
              <input
                type="date"
                name="DT_TERMINO_PREVISTO"
                value={formData.DT_TERMINO_PREVISTO}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          

            <div className="col-span-3 flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
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
