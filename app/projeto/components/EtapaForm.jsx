import { useState } from "react";
import { createItem } from "../services/etapaSevice"; // Refira-se à função de criação de item

export const EtapaForm = ({ onClose, isOpen, nome_projeto }) => {
  const [formData, setFormData] = useState({
    NM_ETAPA: "",
    DT_INICIO_PREVISTO: "",
    DT_TERMINO_PREVISTO: "",
    DT_INICIO_REAL: "",
    DT_TERMINO_REAL: "",
    PERCENT_TOTAL_ETAPA: "",
    PERCENT_EXECUTADO: "",
    PERCENT_PLANEJADO: "",
    SITUA_x00c7__x00c3_O: "",
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

    // Construindo o objeto de dados que será enviado para a API
    const itemData = {
      NM_PROJETO: nome_projeto, // Defina o nome do projeto conforme necessário
      NM_ETAPA: formData.NM_ETAPA,
      DT_INICIO_PREVISTO: formData.DT_INICIO_PREVISTO,
      DT_TERMINO_PREVISTO: formData.DT_TERMINO_PREVISTO,
      DT_INICIO_REAL: formData.DT_INICIO_REAL,
      DT_TERMINO_REAL: formData.DT_TERMINO_REAL,
      PERCENT_TOTAL_ETAPA: formData.PERCENT_TOTAL_ETAPA,
      PERCENT_EXECUTADO: formData.PERCENT_EXECUTADO,
      PERCENT_PLANEJADO: formData.PERCENT_PLANEJADO,
      SITUA_x00c7__x00c3_O: formData.SITUA_x00c7__x00c3_O,
    };

    // Envia os dados para a API
    const response = await createItem(itemData);

   
      alert("Etapa cadastrada com sucesso!");
      onClose(); // Fecha o modal após o cadastro
      window.location.reload()
    
  };

  return (
   isOpen && (<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-[1200px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Etapa</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Nome da Etapa</label>
            <input
              type="text"
              name="NM_ETAPA"
              value={formData.NM_ETAPA}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Data Início Previsto</label>
            <input
              type="date"
              name="DT_INICIO_PREVISTO"
              value={formData.DT_INICIO_PREVISTO}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
             
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
             
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Data Início Real</label>
            <input
              type="date"
              name="DT_INICIO_REAL"
              value={formData.DT_INICIO_REAL}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Data Término Real</label>
            <input
              type="date"
              name="DT_TERMINO_REAL"
              value={formData.DT_TERMINO_REAL}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Percentual Total da Etapa</label>
            <input
              type="number"
              name="PERCENT_TOTAL_ETAPA"
              value={formData.PERCENT_TOTAL_ETAPA}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Percentual Executado</label>
            <input
              type="number"
              name="PERCENT_EXECUTADO"
              value={formData.PERCENT_EXECUTADO}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Percentual Planejado</label>
            <input
              type="number"
              name="PERCENT_PLANEJADO"
              value={formData.PERCENT_PLANEJADO}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
             
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Situação</label>
            <input
              type="text"
              name="SITUA_x00c7__x00c3_O"
              value={formData.SITUA_x00c7__x00c3_O}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
             
            />
          </div>

          <div className="col-span-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>)
  );
};

export default EtapaForm;
