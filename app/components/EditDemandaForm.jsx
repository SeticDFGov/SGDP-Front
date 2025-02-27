import React, { useEffect, useState } from 'react';
import { getItemById, updateItem } from '../services/apiService';
import { getAllCategoria } from '../services/categoriaService';
import { getAllDemandantes } from '../services/demandanteService';

const EditFormModal = ({ itemId, onSave , onClose}) => {
  if(!onClose) return null;

   const responsaveis = [
    "Adriana Christina", "Ana Carolina", "Antônio Jr.", "Camila Rodrigues", "Daniel Cardoso",
    "Daniel CGOV", "Eduardo Galvão", "Felipe Stefens", "Izabel", "Joran Freire", "Marcio Henrique",
    "Munique", "Rayssa Parente", "Rômulo Adan", "Sergio Velozo"
  ];
  const [categorias, setCategorias] = useState([])
  const [demandantes, setDemandantes] = useState([])
  const unidades = ["CGOV", "UCR", "UPTD"];
  const periodos = ["Semanal", "Mensal", "Trimestral", "Quadrimestral", "Semestral", "Anual", "Bienal"];

 const [formData, setFormData] = useState({
  NM_DEMANDA: "",
  DT_SOLICITACAO: "",
  DT_ABERTURA: "",
  DT_CONCLUSAO: "",
  CATEGORIA: "",
  STATUS: "",
  PO_SUBTDCR: "",
  NM_PO_DEMANDANTE: "",
  NM_AREA_DEMANDANTE: "",
  UNIDADE: "",
  NR_PROCESSO_SEI: "",
  PERIODICO: "",
  PERIODICIDADE: "",
  PATROCINADOR: ""
});
  
  const fetchItems = async () => {
    try {
      const responseCategoria = await getAllCategoria();
      const responseDemandante = await getAllDemandantes();
      setDemandantes(responseDemandante)
      setCategorias(responseCategoria);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategorias([]); // Evita que a tabela quebre caso ocorra erro na API
    }
  };

   useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (itemId) {
        try {
          const response = await getItemById(itemId);
          if (response) {
            console.log(response.NM_DEMANDA)
            // Mapear os dados da API para os campos esperados no formulário
            setFormData({
              NM_DEMANDA: response.NM_DEMANDA,
              DT_SOLICITACAO: response.DT_SOLICITACAO.split('T')[0], // Converter para formato de data
              DT_ABERTURA: response.DT_ABERTURA.split('T')[0], // Converter para formato de data
              DT_CONCLUSAO: response.DT_CONCLUSAO ? response.DT_CONCLUSAO.split('T')[0] : '',
              CATEGORIA: response.CATEGORIA,
              STATUS: response.STATUS,
              PO_SUBTDCR: response.PO_SUBTDCR, // Mapear o nome correto
              NM_PO_DEMANDANTE: response.NM_PO_DEMANDANTE ,
              NM_AREA_DEMANDANTE: response.NM_AREA_DEMANDANTE,
              UNIDADE: response.UNIDADE,
              NR_PROCESSO_SEI: response.NR_PROCESSO_SEI ,
              PERIODICO: response.PERIODICO,
              PERIODICIDADE: response.PERIODICIDADE,
              PATROCINADOR: response.PATROCINADOR 
            });
          }
        } catch (error) {
          console.error('Erro ao buscar o item:', error);
        }
      }
    };
    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const body = {};

  if (formData.NM_DEMANDA) body.NM_DEMANDA = formData.NM_DEMANDA;
  if (formData.DT_SOLICITACAO) body.DT_SOLICITACAO = formData.DT_SOLICITACAO;
  if (formData.DT_ABERTURA) body.DT_ABERTURA = formData.DT_ABERTURA;
  if (formData.DT_CONCLUSAO) body.DT_CONCLUSAO = formData.DT_CONCLUSAO;
  if (formData.CATEGORIA) body.CATEGORIA = formData.CATEGORIA;
  if (formData.STATUS) body.STATUS = formData.STATUS;
  if (formData.PO_SUBTDCR) body.PO_SUBTDCR = formData.PO_SUBTDCR;
  if (formData.NM_PO_DEMANDANTE) body.NM_PO_DEMANDANTE = formData.NM_PO_DEMANDANTE;
  if (formData.NM_AREA_DEMANDANTE) body.NM_AREA_DEMANDANTE = formData.NM_AREA_DEMANDANTE;
  if (formData.UNIDADE) body.UNIDADE = formData.UNIDADE;
  if (formData.NR_PROCESSO_SEI) body.NR_PROCESSO_SEI = formData.NR_PROCESSO_SEI;
  if (formData.PERIODICO) body.PERIODICO = formData.PERIODICO;
  if (formData.PERIODICIDADE) body.PERIODICIDADE = formData.PERIODICIDADE;
  if (formData.PATROCINADOR) body.PATROCINADOR = formData.PATROCINADOR;

  try {
    const response = await updateItem(itemId, body);
    if (response) {
      alert("Item atualizado com sucesso!");
      onClose(); // Fecha o modal
      window.location.reload(); // Recarrega a página
    } else {
      alert("Erro ao atualizar item.");
    }
  } catch (error) {
    console.error("Erro ao enviar requisição:", error);
  }
};



  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 overflow-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Editar Demanda</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Nome da Demanda */}
          <div className="flex flex-col">
            <label htmlFor="NM_DEMANDA" className="text-sm font-semibold text-gray-700">Nome da Demanda</label>
            <input
              type="text"
              id="NM_DEMANDA"
              name="NM_DEMANDA"
              value={formData.NM_DEMANDA || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Data de Solicitação, Abertura e Conclusão */}
          {['DT_SOLICITACAO', 'DT_ABERTURA', 'DT_CONCLUSAO'].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="text-sm font-semibold text-gray-700">
                {field.replace('_', ' ').replace('DT', 'Data')}
              </label>
              <input
                type="date"
                id={field}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded"
                /** Regras aplicadas SOMENTE para DT_CONCLUSAO */
                required={field === 'DT_CONCLUSAO' && formData.PERIODICO === 'Concluído'}
                disabled={field === 'DT_CONCLUSAO' && formData.STATUS !== 'Concluído'}
              />
            </div>
          ))}


          {/* Categoria */}
          <div className="flex flex-col">
            <label htmlFor="CATEGORIA" className="text-sm font-semibold text-gray-700">Categoria</label>
            <select
              id="CATEGORIA"
              name="CATEGORIA"
              value={formData.CATEGORIA || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((item) => (
                <option key={item.ID} value={item.NM_CATEGORIA}>
                  {item.NM_CATEGORIA}
                </option>
              ))}
      </select>
           
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label htmlFor="STATUS" className="text-sm font-semibold text-gray-700">Status</label>
            <select
              id="STATUS"
              name="STATUS"
              value={formData.STATUS || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Selecione uma opção</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          {/* Nome do PO SUBTDCR */}
          <div className="flex flex-col">
            <label htmlFor="PO_SUBTDCR" className="text-sm font-semibold text-gray-700">Nome do PO Subtdcr</label>
            <select
              id="PO_SUBTDCR"
              name="PO_SUBTDCR"
              value={formData.PO_SUBTDCR || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Selecione um responsável</option>
              {responsaveis.map((resp) => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
          <label htmlFor="NM_AREA_DEMANDANTE" className="text-sm font-semibold text-gray-700">
            Nome da Área Demandante
          </label>
          <select
        id="NM_AREA_DEMANDANTE"
        name="NM_AREA_DEMANDANTE"
        value={formData.NM_AREA_DEMANDANTE || ''}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Selecione uma área</option>
        {demandantes.map((item) => (
          <option key={item.ID} value={item.NM_DEMANDANTE}>
            {item.NM_DEMANDANTE}
          </option>
        ))}
      </select>
        </div>

          {/* Unidade */}
          <div className="flex flex-col">
            <label htmlFor="UNIDADE" className="text-sm font-semibold text-gray-700">Unidade</label>
            <select
              id="UNIDADE"
              name="UNIDADE"
              value={formData.UNIDADE || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Selecione uma unidade</option>
              {unidades.map((un) => (
                <option key={un} value={un}>{un}</option>
              ))}
            </select>
          </div>

          {/* Número do Processo SEI */}
          <div className="flex flex-col">
            <label htmlFor="NR_PROCESSO_SEI" className="text-sm font-semibold text-gray-700">Número do Processo SEI</label>
            <input
              type="text"
              id="NR_PROCESSO_SEI"
              name="NR_PROCESSO_SEI"
              value={formData.NR_PROCESSO_SEI || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
           
            />
          </div>

          {/* Periódico */}
          <div className="flex flex-col">
            <label htmlFor="PERIODICO" className="text-sm font-semibold text-gray-700">Periódico</label>
            <select
              id="PERIODICO"
              name="PERIODICO"
              value={formData.PERIODICO || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Selecione uma opção</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>

          {/* Periodicidade */}
          <div className="flex flex-col">
            <label htmlFor="PERIODICIDADE" className="text-sm font-semibold text-gray-700">Periodicidade</label>
            <select
              id="PERIODICIDADE"
              name="PERIODICIDADE"
              value={formData.PERIODICIDADE || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
              required={formData.PERIODICO === 'Sim'}
              disabled={formData.PERIODICO !== 'Sim'}
            >
              <option value="">Selecione uma opção</option>
              {periodos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Patrocinador */}
          <div className="flex flex-col">
            <label htmlFor="PATROCINADOR" className="text-sm font-semibold text-gray-700">Patrocinador</label>
            <input
              type="text"
              id="PATROCINADOR"
              name="PATROCINADOR"
              value={formData.PATROCINADOR || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded"
            
            />
          </div>

          <button type="submit" className="w-full col-span-3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Salvar Alterações
          </button>
        </form>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFormModal;
