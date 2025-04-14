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
import { getAllDemandantes } from "../services/demandanteService";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { optionsGraph } from "@/app/projeto/components/config/config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

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
    const [demandante1, setDemandantes] = useState([])
    const [siglasMap, setSiglasMap] = useState([])
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
const [isDataLoaded, setIsDataLoaded] = useState(false);

useEffect(() => {
  const fetchDemandantes = async () => {
    try {
      const response = await getAllDemandantes();
  

      if (!Array.isArray(response)) {
        console.error("Erro: A resposta da API não é um array!");
        return;
      }

      setDemandantes(response);

      const newSiglasMap = {};
      response.forEach((item) => {
        if (item.NM_DEMANDANTE && item.NM_SIGLA) {
          newSiglasMap[item.NM_DEMANDANTE] = item.NM_SIGLA;
        }
      });

    
      setSiglasMap(newSiglasMap);
      setIsDataLoaded(true); 

    } catch (error) {
      console.error("Erro ao buscar demandantes:", error);
    }
  };

  fetchDemandantes();
}, []);


useEffect(() => {

    if (items.length > 0 || Object.keys(tmp).length > 0 || Object.keys(siglasMap).length >0) {
    updateCharts(items);
  }
}, [items, tmp, siglasMap]);

const updateCharts = (data) => {

  const status = { Em_andamento: 0, Atrasados: 0, Realizadas: 0, Nao_iniciada: 0 };
  const demandante = {};



  data.forEach((item) => {


  
    
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
      indexAxis: 'y', 
     layout: {
    padding: {
      right: 50 // mais espaço pros rótulos
    }
  },
    plugins: {
        legend: { display: false },
        datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#000',
            font: {
                weight: 'bold'
            },
            formatter: Math.round 
        }
    },
    scales: {
        x: {
            display: false 
        },
        y: {
            ticks: {
                font: {
                    size: 14
                }
            }
        }
    }
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
const demandanteLabels = Object.keys(demandante).map(nome => {
  // Verificar se a chave existe no siglasMap
  const sigla = siglasMap[nome] || nome; // Se não encontrar a sigla, usa o nome completo
  console.log("Buscando sigla para:", nome, "->", sigla); // Verificar o que está sendo retornado
  return sigla; // Retorna a sigla ou o nome completo
});

const demandanteValues = Object.values(demandante);
console.log(siglasMap);
console.log("Chaves do siglasMap:", Object.keys(siglasMap));

// Combine os dados em um único array para ordenação
const combinedData = demandanteLabels.map((label, index) => ({
  label,
  value: demandanteValues[index],
}));

// Ordena os dados do maior para o menor com base no valor
combinedData.sort((a, b) => b.value - a.value);

const sortedLabels = combinedData.map(item => item.label);
const sortedValues = combinedData.map(item => item.value);

destroyChart(demandanteChartRef);
demandanteChartRef.current.chartInstance = new Chart(demandanteChartRef.current, {
  type: "bar",
  data: {
    labels: sortedLabels, 
    datasets: [
      {
        label: "Quantidade de demandas por Demandante",
        data: sortedValues, 
        backgroundColor: "#1c2c34",
      },
    ],
  },
  options: {
    indexAxis: 'y', 
  
  layout: {
    padding: {
      right: 50 // mais espaço pros rótulos
    }
  },
    plugins: {
        legend: { display: false },
        datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#000',
            font: {
                weight: 'bold'
            },
            formatter: Math.round 
        }
    },
    scales: {
        x: {
            display: false 
        },
        y: {
            ticks: {
                font: {
                    size: 14
                }
            }
        }
    }
  },
});


  
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
                        <p className="text-gray-600">Não Iniciadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#1c2c34"}}>schedule</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mb-4">

                <div className="flex-1 relative">
                  <select
                    defaultValue=""
                    className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
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
                        className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
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
            <h3 className="text-lg font-semibold text-center pb-3">Situação das Demandas</h3>
            <canvas ref={doughnutChartRef} className="max-h-40"></canvas>
        </div>
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Quantidade de Demandas por Área Demandante</h3>
            <canvas ref={demandanteChartRef} className="max-h-40"></canvas>
        </div>
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Quantidade por Tipo</h3>
            <canvas ref={barChartRef} className="max-h-40"></canvas>
        </div>
    </div>
</div>




    <div className="mx-auto bg-white mt-5">

        <div className="p-4 max-w-6xl mx-auto bg-white mt-5 mb-5">

        <div className=" mb-6  justify-items-end">


{isAuthenticated && (
  <div
    onClick={handleOpenModal}
    className="cursor-pointer bg-[rgb(1,98,175,255)] hover:bg-[rgb(1,78,140)] text-white w-10 h-10 rounded-full hover:scale-105 flex items-center justify-center"
    title="Criar nova Demanda"
  >
    <FaPlus className="text-white text-lg" />
  </div>
)}


</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

                <div className="flex-1 relative">
                   <select
                    defaultValue=""
                    className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
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
                <div className="flex-1 relative">
                    <select
  defaultValue=""
  className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
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
  className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none"
>
  <option value="" >
    Selecione a situação
  </option>
  <option value="Atrasado">Atrasado</option>
  <option value="Em andamento">Em andamento</option>
  <option value="Concluído">Não iniciada</option>
  <option value="Concluído">Concluído</option>
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
                    <input type="text" placeholder="Buscar"
                        className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>

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
                                <th className="border p-2 text-left">Tipo</th>
                                <th className="border p-2 text-left">Área Demandante</th>
                                {isAuthenticated && <th className="border p-2 text-left">Responsável</th>
}
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
                                {
                                  (() => {
  try {
    const date = new Date(item.DT_ABERTURA);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC"
    }).format(date);
  } catch {
    return "";
  }
})()

                                }
                                </td>
                                <td className="border p-2">{item.STATUS}</td>
                                <td className="border p-2">{item.CATEGORIA}</td>
                                <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                                {isAuthenticated && <td className="border p-2">{item.NM_PO_SUBTDCR}</td>
 }
                                <td className="border p-2">
                                    {
                                         (() => {
  try {
    const data = new Date(item.DT_CONCLUSAO);
    
    // Verifica se a data é inválida ou se é 31/12/1969
    if (isNaN(data) || data.toDateString() === new Date(0).toDateString()) {
      throw new Error("Data inválida");
    }

    return data.toLocaleDateString("pt-BR");
  } catch {
    return "";
  }
})()

                                    }
                                </td>



                                <td className="border p-2">{item.UNIDADE}</td>

                                {isAuthenticated && (
<td className="border p-2 justify-center gap-2">
  <div className="flex justify-center items-center gap-2">
  <button
      className="text-[rgb(1,98,175,255)] hover:text-[rgb(1,78,140)] hover:scale-105"
      onClick={() => { handleOpenDetailModal(item.ID, item); setNomeId(item.NM_DEMANDA); }}
    >
      <span className="material-icons">visibility</span>
    </button>
    <button
        className="text-[rgb(1,98,175,255)] hover:text-[rgb(1,78,140)] hover:scale-105"
        onClick={() => handleDeleteItem(item.ID)}
      >
      <span className="material-icons">delete</span>
      </button>
      <button
        className="text-[rgb(1,98,175,255)] hover:text-[rgb(1,78,140)] hover:scale-105"
        onClick={() => handleOpenEditModal(item.ID)}
      >
      <span className="material-icons">edit</span>
      </button>
  </div>

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