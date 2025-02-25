import { useState, useEffect, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Chart from "chart.js/auto";
import { deleteItem, getAllItems } from "../services/apiService";
import { FaTrash, FaEdit , FaPlus} from 'react-icons/fa';
import Modal from "./Modal";
import CadastroDemanda from "./DemandaForm";
import EditFormModal from "./EditDemandaForm";

const Dashboard = () => {
  const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const barChartRef = useRef(null);const [isModalOpen, setIsModalOpen] = useState(false);
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
   const handleOpenEditModal = (id) => {
    setSelectedItemId(id);
    setIsModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
    setIsModalEditOpen(false);
    setSelectedItemId(null);
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

   const handleAuthenticate = () => {
    localStorage.removeItem("authenticated");
     setIsAuthenticated(false)
     window.location.reload()
   }

    const destroyChart = (chartRef) => {
    if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
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
        console.log("Dados recebidos:", data);

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
  if (items.length > 0) {
    updateCharts(items);
  }
}, [items]);
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
    if (item.STATUS === "Atrasados") status["Atrasados"] += 1;
    if (item.STATUS === "Realizadas") status["Realizadas"] += 1;
    
    // Contabilizar demandantes

    setAndamento(status["Em_andamento"])
    setAtrasado(status["Atrasados"])
    setConcluido(status["Realizadas"])
    setNao(status["Nao_iniciada"])

    const nome = item.NM_PO_DEMANDANTE;
    if (!demandante[nome]) {
      demandante[nome] = 1;
    } else {
      demandante[nome] += 1;
    }
  });

  const labels = Object.keys(categorias);
  const valoresMedios = labels.map((cat) => categorias[cat].soma / categorias[cat].count);

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
  });

  // Gráfico de status
  destroyChart(doughnutChartRef);
  doughnutChartRef.current.chartInstance = new Chart(doughnutChartRef.current, {
    type: "doughnut",
    data: {
      labels: ["Realizadas", "Em andamento", "Atrasadas", "Não iniciada"],
      datasets: [
        {
          data: [status["Realizadas"], status["Em_andamento"], status["Atrasados"], status["Nao_iniciada"]],
          backgroundColor: ["#17eba0", "#ffbc44", "#fc6161", "#1c2c34"],
        },
      ],
    },
  });

  // Gráfico de demandantes
  const demandanteLabels = Object.keys(demandante);
  const demandanteValues = Object.values(demandante);

  destroyChart(demandanteChartRef);
  demandanteChartRef.current.chartInstance = new Chart(demandanteChartRef.current, {
    type: "bar",
    data: {
      labels: demandanteLabels,
      datasets: [
        {
          label: "Quantidade de demandas por Demandante",
          data: demandanteValues,
          backgroundColor: "#1c2c34",
        },
      ],
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

    <nav className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                   
                    <button type="button" 
                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Abrir menu principal</span>
                      
                        <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
               
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                    <div className="flex flex-shrink-0 items-center">
                        <img className="h-14 w-auto"
                            src="images.png"
                            alt="SUBTDCR"/>
                    </div>
                    
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Home</a>
                            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Demandas</a>

                            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Categorias</a>

                            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Demandante</a>
                            
                        </div>
                    </div>
                   
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!isAuthenticated &&
                    ( <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <a href="/login"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block border-2 rounded-md px-3 py-2 text-base font-medium">Área
                                logada</a>
                        </div>
                    </div>)
                }
                   
                   
                </div>
            </div>
        </div>
       {isAuthenticated && (
  <div className="sm:block" id="mobile-menu">
    <div className="flex items-center space-x-4 pb-4 bg-gray-800 rounded-lg p-3 shadow-lg">
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">Logado como:</p>
        <p className="text-green-400 text-lg font-bold">Administrador</p>
      </div>
      <button
        onClick={handleAuthenticate}
        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition duration-300"
      >
        Logout
      </button>
    </div>
  </div>
)}

       
    </nav>
    
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
                        <p className="text-gray-600">demandas Realizadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: '#17eba0'}}>check_circle</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#ffbc44" ,height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{andamneto}</h3>
                        <p className="text-gray-600">demandas em andamento</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#ffbc44"}}>pending</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#fc6161", height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{atrasado}</h3>
                        <p className="text-gray-600">demandas atrasadas</p>
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
                    defaultValue="todos"
                    className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
                    >
                    <option value="" disabled>
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
                        defaultValue="todas"
                        className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
                        >
                        <option value="" disabled>
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
       
    
   <div className=" max-w-6xl mx-auto bg-white text-black">
            <div className="flex flex-col lg:flex-row p-4 ">
                <div className="w-full lg:w-2/4 mb-4 lg:mb-0 lg:mr-4 bg-white shadow-lg rounded-2xl">
                    <div className=" p-4 col-span-1 lg:col-span-2">
                        <h3 className="text-xl font-semibold text-center mt-5">Status de demandas</h3>
                        <canvas ref={doughnutChartRef}></canvas>
                    </div>
                </div>
                <div className="w-full lg:w-2/4 mb-4 lg:mb-0 lg:mr-4">
                    <div className="bg-white shadow-lg rounded-2xl p-4 col-span-1 lg:col-span-2">
                        <h3 className="text-xl font-semibold text-center">Quantidade de demandas por demandante</h3>
                        <canvas ref={demandanteChartRef}></canvas>
                        <h3 className="text-xl font-semibold text-center">Tempo Médio por Demanda</h3>
                        <canvas ref={barChartRef}></canvas>
                    </div>
                </div>

            </div>
        </div>

    
    <div className="mx-auto bg-white mt-5">
        <div className="p-4 max-w-6xl mx-auto bg-white mt-5 mb-5">
         
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

                <div className="flex-1 relative">
                   <select
                    defaultValue="todas"
                    className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none"
                    >
                    <option value="" disabled>
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
  defaultValue="todas"
  className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none"
>
  <option value="" disabled>
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
  <option value="" disabled>
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


            <div className="flex gap-4 text-black">
              
                <div className="flex-1 overflow-x-auto mt-2">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Nome Demanda</th>
                                <th className="border p-2 text-left">Data de Abertura</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Categoria</th>
                                <th className="border p-2 text-left">Demandante</th>
                                <th className="border p-2 text-left">Data da Conclusão</th>
                                <th className="border p-2 text-left">Responsável</th>
                                <th className="border p-2 text-left">Detalhes</th>
                                {isAuthenticated && <th className="border p-2">Ações</th>}
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
                                <td className="border p-2">{item.NM_PO_DEMANDANTE}</td>
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
                                <td className="border p-2">{item.PO_SUBTDCR}</td>
                                <td className="border p-2">{item.NM_PO_SUBTDCR}</td>
                                {isAuthenticated && (
                                <td className="border p-2 flex gap-2 justify-center">
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
