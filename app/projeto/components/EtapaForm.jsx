import { useState } from "react";
import { createEtapa, createItem } from "../services/etapaSevice"; // Refira-se à função de criação de item

export const EtapaForm = ({ onClose, isOpen, id }) => {
  const [formData, setFormData] = useState({
    NM_PROJETO: id,
    NM_ETAPA: "",
    DT_INICIO_PREVISTO: "",
    DT_TERMINO_PREVISTO: "",
    PERCENT_TOTAL_ETAPA: "",
    RESPONSAVEL_ETAPA:"" ,

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
// Aqui você captura a data no formato yyyy-mm-dd
const handleSubmit = async (e) => {
  e.preventDefault();

  // Função para formatar a data no formato dd-mm-yyyy
  const formatDate = (date) => {
    if (!date) return ""; // Se não houver data, retorna uma string vazia

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Construindo o objeto de dados que será enviado para a API
  const itemData = {
    NM_PROJETO: formData.NM_PROJETO,
    NM_ETAPA: formData.NM_ETAPA,
    DT_INICIO_PREVISTO: formData.DT_INICIO_PREVISTO,
    DT_TERMINO_PREVISTO: formData.DT_TERMINO_PREVISTO,
    PERCENT_TOTAL_ETAPA: formData.PERCENT_TOTAL_ETAPA,
    PERCENT_PLANEJADO: formData.PERCENT_PLANEJADO,
    RESPONSAVEL_ETAPA:formData.RESPONSAVEL_ETAPA, 

  };

  // Envia os dados para a API
  const response = await createEtapa(itemData, id);

  
    alert("Etapa cadastrada com sucesso!");
    onClose(); // Fecha o modal após o cadastro
    window.location.reload(); // Recarrega a página
  
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
              required
            />
          </div>
           <div className="mb-4">
            <label className="block text-sm font-medium">Responsável pela Etapa</label>
            <input
              type="text"
              name="RESPONSAVEL_ETAPA"
              value={formData.RESPONSAVEL_ETAPA}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
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

     
          <div className="mb-4">
            <label className="block text-sm font-medium">Percentual Total da Etapa</label>
            <input
              type="number"
              name="PERCENT_TOTAL_ETAPA"
              value={formData.PERCENT_TOTAL_ETAPA}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required            
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
