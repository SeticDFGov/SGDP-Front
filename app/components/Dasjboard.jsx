import { useState, useEffect, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Chart from "chart.js/auto";
import { deleteItem, getAllItems, tmpAVG } from "../services/apiService";
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import Modal from "./Modal";
import CadastroDemanda from "./DemandaForm";
import EditFormModal from "./EditDemandaForm";
import { useRouter } from "next/navigation";
import Header from "./Header";
import DemandDetailsModal from "./Detalhamento";


const Dashboard = () => {
  const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const barChartRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const doughnutChartRef = useRef(null);
    const demandanteChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const [andamneto, setAndamento] = useState(0);
    const [atrasado, setAtrasado] = useState(0);
    const [concluido, setConcluido] = useState(0);
    const [nao, setNao] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
    const [nomeId, setNomeId] = useState(null)
    const [tmp, setTmp] = useState({})
    const [detail, setDetail] = useState(null)
   const handleOpenEditModal = (id) => {
    setSelectedItemId(id);
    setIsModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
    setIsModalEditOpen(false);
    setSelectedItemId(null);
    };
   const handleOpenDetailModal = (id, item) => {
    console.log(id)
    setDetail(item)    
    setNomeId(id);
    setIsModalDetailOpen(true);
  };

  // Fecha o modal
  const handleCloseDetailModal = () => {
    // Verifique se o modal está aberto antes de tentar fechá-lo
    if (isModalDetailOpen) {
      setIsModalDetailOpen(false);
      setNomeId(null);
    }
  };
    const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
    const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      console.log(`Excluindo item com ID: ${id}`);
      // Adicione a lógica para excluir aqui
    }
  };

    useEffect(() => {
    const authStatus = localStorage.getItem("authenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

 

    const destroyChart = (chartRef) => {
    if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
    }
    };
    
    const handleTmpAVG = async () => {
    setIsLoading(true);
    try {
      const data = await tmpAVG();
    
      setTmp(data);
        
    } catch (error) {
        console.error("Erro ao buscar itens", error);
    } finally {
        setIsLoading(false);
    }
  };

  

  const handleDeleteItem = async (id) => {
  // Exibe um alerta de confirmação
  const confirmDelete = window.confirm("Tem certeza que deseja excluir esta demanda?");
  
  if (!confirmDelete) return;

  try {
    const response = await deleteItem(id);

    if (response) {
      alert("demanda excluída com sucesso!");
      window.location.reload(); // Recarrega a página após a exclusão
    } else {
      alert("Erro ao excluir a demanda.");
    }
  } catch (error) {
    console.error("Erro ao excluir a demanda:", error);
    alert("Falha ao excluir a demanda.");
  }
};

    const fetchItems = async () => {
    setIsLoading(true);
    try {
        const data = await getAllItems();
       

        if (!Array.isArray(data)) {
        console.warn("O retorno da API não é um array:", data);
        setItems([]);
        return;
        }

        setItems(data);
    } catch (error) {
        console.error("Erro ao buscar itens", error);
    } finally {
        setIsLoading(false);
    }
  };

useEffect(() => {
  fetchItems();
}, []);
useEffect(() => {
    handleTmpAVG();
  }, []);

useEffect(() => {
  
    if (items.length > 0 || Object.keys(tmp).length > 0) {
    updateCharts(items);
  }
}, [items, tmp]);

const updateCharts = (data) => {
  const categorias = {};
  const status = { Em_andamento: 0, Atrasados: 0, Realizadas: 0, Nao_iniciada: 0 };
  const demandante = {};



  data.forEach((item) => {
    
    
    // Contabilizar categorias
    if (!categorias[item.CATEGORIA]) {
      categorias[item.CATEGORIA] = { soma: 0, count: 0 };
    }
    
    categorias[item.CATEGORIA].soma += 1;
    categorias[item.CATEGORIA].count += 1;

    // Contabilizar status
    if (item.STATUS === "Em andamento") status["Em_andamento"] += 1;
    if (item.STATUS === "Não iniciada") status["Nao_iniciada"] += 1;
    if (item.STATUS === "Atrasado") status["Atrasados"] += 1;
    if (item.STATUS === "Concluído") status["Realizadas"] += 1;
    
    // Contabilizar demandantes

    setAndamento(status["Em_andamento"])
    setAtrasado(status["Atrasados"])
    setConcluido(status["Realizadas"])
    setNao(status["Nao_iniciada"])

    const nome = item.NM_AREA_DEMANDANTE;
    if (!demandante[nome]) {
      demandante[nome] = 1;
    } else {
      demandante[nome] += 1;
    }
  });

  const labels = Object.keys(tmp); // Pega as categorias (chaves do objeto)
  const valoresMedios = Object.values(tmp); // Pega os valores (valores do objeto)

    
  // Gráfico de categorias
  destroyChart(barChartRef);
  
  barChartRef.current.chartInstance = new Chart(barChartRef.current, {
  type: "bar",
  data: {
    labels,
    datasets: [
      {
        label: "Média por Categoria",
        data: valoresMedios,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  },
    options: {
      indexAxis: "y", // Inverte os eixos (X vira Y e Y vira   X)
      plugins: {
        legend: {
          display: false,
          position: "bottom", // Move a legenda para baixo
        },
      },
    },
  });


  // Gráfico de status
  destroyChart(doughnutChartRef);
  doughnutChartRef.current.chartInstance = new Chart(doughnutChartRef.current, {
    type: "doughnut",
    data: {
      labels: ["Concluída", "Em andamento", "Atrasada", "Não iniciada"],
      datasets: [
        {
          data: [status["Realizadas"], status["Em_andamento"], status["Atrasados"], status["Nao_iniciada"]],
          backgroundColor: ["#17eba0", "#ffbc44", "#fc6161", "#1c2c34"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom", // Move a legenda para baixo
        },
      },
    },
  });

  // Gráfico de demandantes
  const demandanteLabels = Object.keys(demandante);
  const demandanteValues = Object.values(demandante);

  destroyChart(demandanteChartRef);
  demandanteChartRef.current.chartInstance = new Chart(demandanteChartRef.current, {
    type: "bar",
    data: {
      labels: demandanteLabels ,
      datasets: [
        {
          label: "Quantidade de demandas por Demandante",
          data: demandanteValues,
          backgroundColor: "#1c2c34",
        },
      ],
    },
    options: {
      indexAxis: "y", // Inverte os eixos (X vira Y e Y vira   X)
      plugins: {
        legend: {
          display: true,
          position: "bottom", // Move a legenda para baixo
        },
      },
    },
  });

  // Gráfico de linha (fixo conforme o exemplo)
  destroyChart(lineChartRef);
  // lineChartRef.current.chartInstance = new Chart(lineChartRef.current, {
  //   type: "line",
  //   data: {
  //     labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
  //     datasets: [
  //       {
  //         data: [10, 15, 8, 12],
  //         borderColor: "#fc6161",
  //         fill: true,
  //       },
  //     ],
  //   },
  // });
};

return (

    <div className="bg-white">

   <Header>
   </Header>
    
    <div className="mx-auto bg-white ">
        <div className=" max-w-6xl mx-auto bg-white mt p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-semibold text-black ">Bem-vindo ao sistema de gestão da SUBTDCR</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 text-black">
                
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                   style={{ borderColor: '#17eba0', height: 'auto' }}>

                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{concluido}</h3>
                        <p className="text-gray-600">Demandas Concluídas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: '#17eba0'}}>check_circle</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#ffbc44" ,height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{andamneto}</h3>
                        <p className="text-gray-600">Demandas em Andamento</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#ffbc44"}}>pending</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#fc6161", height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{atrasado}</h3>
                        <p className="text-gray-600">Demandas Atrasadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#fc6161"}}>warning</span>
                </div>
             
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#1c2c34", height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{nao}</h3>
                        <p className="text-gray-600">Não iniciadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#1c2c34"}}>schedule</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mb-4">

                <div className="flex-1 relative">
                  <select
                    defaultValue=""
                    className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
                    >
                    <option value="" >
                        Selecione o período
                    </option>
                    <option value="todos">Todos</option>
                    <option value="semana">Última semana</option>
                    <option value="mes">Último mês</option>
                    <option value="6meses">Últimos 6 meses</option>
                    <option value="ano">Último ano</option>
                    </select>
 
                    
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                   <select
                        defaultValue=""
                        className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
                        >
                        <option value="" >
                            Selecione uma categoria
                        </option>
                        <option value="todas">Todas</option>
                        <option value="categoria">Categoria</option>
                        </select>

                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

        </div>
       
    
 <div className="max-w-6xl mx-auto bg-white text-black">
    <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 p-4">
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Situação da demanda</h3>
            <canvas ref={doughnutChartRef} className="max-h-40"></canvas>
        </div>
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Quantidade de demandas por Área demandante</h3>
            <canvas ref={demandanteChartRef} className="max-h-40"></canvas>
        </div>
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Tempo Médio por Tipo</h3>
            <canvas ref={barChartRef} className="max-h-40"></canvas>
        </div>
    </div>
</div>



    
    <div className="mx-auto bg-white mt-5">
        <div className="p-4 max-w-6xl mx-auto bg-white mt-5 mb-5">
         
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

                <div className="flex-1 relative">
                   <select
                    defaultValue=""
                    className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none"
                    >
                    <option value="" >
                        Selecione uma categoria
                    </option>
                    <option value="todas">Todas</option>
                    <option value="categoria">Categoria</option>
                    </select>

                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <select
  defaultValue=""
  className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none"
>
  <option value="" >
    Selecione a unidade
  </option>
  <option value="todas">Todas</option>
  <option value="CGOV">CGOV</option>
  <option value="UCR">UCR</option>
  <option value="UPTD">UPTD</option>
</select>

                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <select
  defaultValue=""
  className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none"
>
  <option value="" >
    Selecione o status
  </option>
  <option value="Atrasado">Atrasado</option>
  <option value="Em andamento">Em andamento</option>
  <option value="Concluído">Concluído</option>
</select>

                  
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <input type="text" placeholder="Buscar"
                        className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.32 3.906l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387A6 6 0 012 8z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

            </div>

            {isAuthenticated && (<div onClick={handleOpenModal} className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <FaPlus className="text-blue-500 text-xl" />
            <span className="text-gray-700">Inserir demanda</span>
            </div>)}
            
           <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <CadastroDemanda onClose = {handleCloseModal} ></CadastroDemanda>
           </Modal>

           <Modal isOpen={isModalEditOpen} onClose={handleCloseEditModal}>
            <EditFormModal itemId = {selectedItemId} onClose={handleCloseEditModal}></EditFormModal>
           </Modal>
              <DemandDetailsModal isOpen={isModalDetailOpen} onClose={handleCloseDetailModal} demandaId={nomeId} item = {detail}>

              </DemandDetailsModal>

            <div className="flex gap-4 text-black">
              
                <div className="flex-1 overflow-x-auto mt-2">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Nome Demanda</th>
                                <th className="border p-2 text-left">Data de Abertura</th>
                                <th className="border p-2 text-left">Situação</th>
                                <th className="border p-2 text-left">Categoria</th>
                                <th className="border p-2 text-left">Área Demandante</th>
                                <th className="border p-2 text-left">Data da Conclusão</th>
                                <th className="border p-2 text-left">Unidade SUBTDCR</th>
                                {isAuthenticated && <th className="border p-2 text-left">Ações</th>}
                               
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.ID} className="shadow">   
                                <td className="border p-2">{item.NM_DEMANDA}</td>
                        
                              <td className="border p-2">
                                {(() => {
                                    try {
                                    const data = new Date(item.DT_ABERTURA);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()}
                                </td>
                                <td className="border p-2">{item.STATUS}</td>
                                <td className="border p-2">{item.CATEGORIA}</td>
                                <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                                <td className="border p-2">
                                    {
                                         (() => {
                                    try {
                                    const data = new Date(item.DT_CONCLUSAO);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()
                                    }
                                </td>

                                <td className="border p-2">{item.UNIDADE}</td>
                               
                                
  {isAuthenticated && (
    <td className="border p-2 flex gap-2 justify-center">
    <button
      className="text-red-500 hover:text-red-700"
      onClick={() => { handleOpenDetailModal(item.NM_DEMANDA, item); setNomeId(item.NM_DEMANDA); }}
    >
      <FaEye />
    </button>
    </td>
  )}


  {isAuthenticated && (
    <td className="border p-2 flex gap-2 justify-center">
    <>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDeleteItem(item.ID)}
      >
        <FaTrash />
      </button>
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => handleOpenEditModal(item.ID)}
      >
        <FaEdit />
      </button>
    </>
    </td>
  )}


                                </tr>
                            ))}
                           
                
                        </tbody>
                    </table>
                 
                    <div className="pagination mx-auto mt-5" style={{textAlign: "center"}}>
                        <button id="prev" className="button is-primary">
                            <span className="material-icons">chevron_left</span>
                        </button>

                        <button id="next" className="button is-primary">
                            <span className="material-icons">chevron_right</span>
                        </button>
                    </div>
                </div>

            </div>


        </div>
    </div>

    
    

  </div>

 </div>
);

};

export default Dashboard;
