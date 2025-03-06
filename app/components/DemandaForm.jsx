import { useEffect, useState } from "react";
import { createItem } from "../services/apiService";
import { getAllCategoria } from "../services/categoriaService";
import { getAllDemandantes } from "../services/demandanteService";


const CadastroDemanda = ({onClose}) => {
  
  if(!onClose) return null;

  const [categorias, setCategorias] = useState([])
  const [demandantes, setDemandantes] = useState([])
  const [formData, setFormData] = useState({
    NM_DEMANDA: "",
    DT_SOLICITACAO: "",
    DT_ABERTURA: "",
    DT_CONCLUSAO: "",
    CATEGORIA: "",
    STATUS: "",
    NM_PO_SUBTDCR: "",
    NM_PO_DEMANDANTE: "",
    NM_AREA_DEMANDANTE :"",
    UNIDADE: "",
    NR_PROCESSO_SEI: "",
    PERIODICO: "",
    PERIODICIDADE: "",
    PATROCINADOR: "",
  });

  const fetchItems = async () => {
    try {
      const responseCategoria = await getAllCategoria();
      const responseDemandante = await getAllDemandantes();
      setCategorias(responseCategoria);
      setDemandantes(responseDemandante)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategorias([]); // Evita que a tabela quebre caso ocorra erro na API
    }
  };

   useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Criar o corpo da requisição conforme o formato necessário
    const body = {};

if (formData.NM_DEMANDA) body.NM_DEMANDA = formData.NM_DEMANDA;
if (formData.DT_SOLICITACAO) body.DT_SOLICITACAO = formData.DT_SOLICITACAO;
if (formData.DT_ABERTURA) body.DT_ABERTURA = formData.DT_ABERTURA;
if (formData.DT_CONCLUSAO) body.DT_CONCLUSAO = formData.DT_CONCLUSAO;
if (formData.CATEGORIA) body.CATEGORIA = formData.CATEGORIA;
if (formData.STATUS) body.STATUS = formData.STATUS;
if (formData.NM_PO_SUBTDCR) body.PO_SUBTDCR = formData.NM_PO_SUBTDCR;
if (formData.NM_PO_DEMANDANTE) body.NM_PO_DEMANDANTE = formData.NM_PO_DEMANDANTE;
if (formData.UNIDADE) body.UNIDADE = formData.UNIDADE;
if (formData.NR_PROCESSO_SEI) body.NR_PROCESSO_SEI = formData.NR_PROCESSO_SEI;
if (formData.PERIODICO) body.PERIODICO = formData.PERIODICO;
if (formData.PERIODICIDADE) body.PERIODICIDADE = formData.PERIODICIDADE;
if (formData.PATROCINADOR) body.PATROCINADOR = formData.PATROCINADOR;




    // Enviar os dados via API (substitua a URL pela URL correta do SharePoint)
    try {
      const response = await createItem(body);

      if (response) {
        alert("Demanda cadastrada com sucesso!");
        setFormData({
          NM_DEMANDA: "",
          DT_SOLICITACAO: "",
          DT_ABERTURA: "",
          DT_CONCLUSAO: "",
          CATEGORIA: "",
          STATUS: "",
          NM_PO_SUBTDCR: "",
          NM_PO_DEMANDANTE: "",
          NM_AREA_DEMANDANTE:"",
          UNIDADE: "",
          NR_PROCESSO_SEI: "",
          PERIODICO: "",
          PERIODICIDADE: "",
          PATROCINADOR: "",

        })
        onClose();; // Limpar os campos após sucesso
        window.location.reload()
      } else {
        alert("Erro ao cadastrar demanda");
      }
    } catch (error) {
      alert("Erro na requisição");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">

   
     <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-semibold text-center">Cadastro de Demanda</h2>

      {/* Grid com 3 colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nome da Demanda */}
        <div className="flex flex-col">
          <label htmlFor="NM_DEMANDA" className="text-sm font-semibold text-gray-700">
            Nome da Demanda
          </label>
          <input
            type="text"
            id="NM_DEMANDA"
            name="NM_DEMANDA"
            value={formData.NM_DEMANDA}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Data de Solicitação */}
        <div className="flex flex-col">
          <label htmlFor="DT_SOLICITACAO" className="text-sm font-semibold text-gray-700">
            Data da Solicitação
          </label>
          <input
            type="date"
            id="DT_SOLICITACAO"
            name="DT_SOLICITACAO"
            value={formData.DT_SOLICITACAO}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Data de Abertura */}
        <div className="flex flex-col">
          <label htmlFor="DT_ABERTURA" className="text-sm font-semibold text-gray-700">
            Data de Abertura
          </label>
          <input
            type="date"
            id="DT_ABERTURA"
            name="DT_ABERTURA"
            value={formData.DT_ABERTURA}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Data de Conclusão */}
        <div className="flex flex-col">
          <label htmlFor="DT_CONCLUSAO" className="text-sm font-semibold text-gray-700">
            Data de Conclusão
          </label>
          <input
            type="date"
            id="DT_CONCLUSAO"
            name="DT_CONCLUSAO"
            value={formData.DT_CONCLUSAO}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required={formData.PERIODICO=== "Concluído"}
           
          />
        </div>

        {/* Categoria */}
            <div className="flex flex-col">
      <label htmlFor="CATEGORIA" className="text-sm font-semibold text-gray-700">
        Categoria
      </label>
      <select
        id="CATEGORIA"
        name="CATEGORIA"
        value={formData.CATEGORIA}
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
          <label htmlFor="STATUS" className="text-sm font-semibold text-gray-700">
            Situação
          </label>
          <select
            id="STATUS"
            name="STATUS"
            value={formData.STATUS}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Selecione a Situação</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Não iniciada">Não iniciada</option>

          </select>
        </div>

        {/* Nome do Subtítulo */}
<div className="flex flex-col">
  <label htmlFor="NM_PO_SUBTDCR" className="text-sm font-semibold text-gray-700">
    Nome do Responsável SUBTDCR
  </label>
  <select
    id="NM_PO_SUBTDCR"
    name="NM_PO_SUBTDCR"
    value={formData.NM_PO_SUBTDCR}
    onChange={handleChange}
    className="mt-1 p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Selecione um responsável</option>
    <option value="Adriana Christina">Adriana Christina</option>
    <option value="Ana Carolina">Ana Carolina</option>
    <option value="Antônio Jr.">Antônio Jr.</option>
    <option value="Camila Rodrigues">Camila Rodrigues</option>
    <option value="Daniel Cardoso">Daniel Cardoso</option>
    <option value="Daniel CGOV">Daniel CGOV</option>
    <option value="Eduardo Galvão">Eduardo Galvão</option>
    <option value="Felipe Stefens">Felipe Stefens</option>
    <option value="Izabel">Izabel</option>
    <option value="Joran Freire">Joran Freire</option>
    <option value="Marcio Henrique">Marcio Henrique</option>
    <option value="Munique">Munique</option>
    <option value="Rayssa Parente">Rayssa Parente</option>
    <option value="Rômulo Adan">Rômulo Adan</option>
    <option value="Sergio Velozo">Sergio Velozo</option>
  </select>
</div>



        {/* Nome do Demandante */}
        <div className="flex flex-col">
          <label htmlFor="NM_PO_DEMANDANTE" className="text-sm font-semibold text-gray-700">
            Nome do Demandante
          </label>
          
          <input
            type="text"
            id="NM_PO_DEMANDANTE"
            name="NM_PO_DEMANDANTE"
            value={formData.NM_PO_DEMANDANTE}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Nome do Demandante */}
        <div className="flex flex-col">
          <label htmlFor="NM_AREA_DEMANDANTE" className="text-sm font-semibold text-gray-700">
            Nome da Área Demandante
          </label>
          <select
        id="NM_AREA_DEMANDANTE"
        name="NM_AREA_DEMANDANTE"
        value={formData.NM_AREA_DEMANDANTE}
        onChange={handleChange}
        className="mt-1 p-2 border border-gray-300 rounded"
        required
      >
        <option value="">Selecione uma área Demandante</option>
        {demandantes.map((item) => (
          <option key={item.ID} value={item.NM_DEMANDANTE}>
            {item.NM_DEMANDANTE}
          </option>
        ))}
      </select>
        </div>

        {/* Unidade */}
<div className="flex flex-col">
  <label htmlFor="UNIDADE" className="text-sm font-semibold text-gray-700">
    Unidade
  </label>
  <select
    id="UNIDADE"
    name="UNIDADE"
    value={formData.UNIDADE}
    onChange={handleChange}
    className="mt-1 p-2 border border-gray-300 rounded"
    required
  >
    <option value="">Selecione a unidade</option>
    <option value="CGOV">CGOV</option>
    <option value="UCR">UCR</option>
    <option value="UPTD">UPTD</option>
  </select>
</div>



        {/* Número do Processo SEI */}
        <div className="flex flex-col">
          <label htmlFor="NR_PROCESSO_SEI" className="text-sm font-semibold text-gray-700">
            Número do Processo SEI
          </label>
          <input
            type="text"
            id="NR_PROCESSO_SEI"
            name="NR_PROCESSO_SEI"
            value={formData.NR_PROCESSO_SEI}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Periódico */}
<div className="flex flex-col">
  <label htmlFor="PERIODICO" className="text-sm font-semibold text-gray-700">
    Periódico
  </label>
  <select
    id="PERIODICO"
    name="PERIODICO"
    value={formData.PERIODICO}
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
  <label htmlFor="PERIODICIDADE" className="text-sm font-semibold text-gray-700">
    Periodicidade
  </label>
  <select
    id="PERIODICIDADE"
    name="PERIODICIDADE"
    value={formData.PERIODICIDADE}
    onChange={handleChange}
    className="mt-1 p-2 border border-gray-300 rounded"
    required={formData.PERIODICO === "Sim"}
    disabled={formData.PERIODICO !== "Sim"}
  >
    <option value="">Selecione uma opção</option>
    <option value="Semanal">Semanal</option>
    <option value="Mensal">Mensal</option>
    <option value="Trimestral">Trimestral</option>
    <option value="Quadrimestral">Quadrimestral</option>
    <option value="Semestral">Semestral</option>
    <option value="Anual">Anual</option>
    <option value="Bienal">Bienal</option>
  </select>
</div>



        {/* Patrocinador */}
        <div className="flex flex-col">
          <label htmlFor="PATROCINADOR" className="text-sm font-semibold text-gray-700">
            Patrocinador
          </label>
          <input
            type="text"
            id="PATROCINADOR"
            name="PATROCINADOR"
            value={formData.PATROCINADOR}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded"
            
          />
        </div>
      </div>

     
      
      <div className="flex justify-end space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Cadastrar Demanda</button>
          <button onClick={onClose} type="button" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Fechar</button>
        </div>
    </form>
    
 </div>
  );
};

export default CadastroDemanda;
