"use client"

import { useState, useEffect, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Chart from "chart.js/auto";
import { deleteItem, getAllItems, tmpAVG } from "../services/apiService";
import { getAllDemandantes } from "../services/demandanteService";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Sidebar from "../components/SIdebar";

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
    const doughnutChartRef = useRef(null);
    const demandanteChartRef = useRef(null);
    const [andamneto, setAndamento] = useState(0);
    const [atrasado, setAtrasado] = useState(0);
    const [concluido, setConcluido] = useState(0);
    const [nao, setNao] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tmp, setTmp] = useState({})
    const [demandante1, setDemandantes] = useState([])
    const [siglasMap, setSiglasMap] = useState([])




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

// Junta os pares (label, valor) em um array de objetos
const pares = Object.entries(tmp); // [[label1, valor1], [label2, valor2], ...]

// Ordena do maior para o menor valor
pares.sort((a, b) => b[1] - a[1]);

// Separa novamente os labels e os valoresMedios
const labels = pares.map(par => par[0]);
const valoresMedios = pares.map(par => par[1]);

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
  <>
 

    <div className="bg-white flex-1 flex flex-col ml-64">
<Sidebar></Sidebar>
  <main className="flex-1 p-4 bg-white rounded-lg shadow">
  <div className="flex-1 m-4 bg-white rounded-lg">
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 mb-4">
        <div className="flex-1 relative">
          <select className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none cursor-pointer transition">
            <option value="" disabled selected>Selecione o período</option>
            <option value="">Todos</option>
            <option value="">Última semana</option>
            <option value="">Último mês</option>
            <option value="">Últimos 6 meses</option>
            <option value="">Último ano</option>
          </select>
          {/* Ícone do Select */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex-1 relative">
          <select className="w-full border rounded p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none cursor-pointer transition">
            <option value="" disabled selected>Selecione uma categoria</option>
            <option>Todas</option>
            <option>Categoria</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2" style={{ borderColor: "#17eba0", height: "auto" }}>
          <div className="text-left">
            <h3 className="text-3xl font-bold">{concluido}</h3>
            <p className="text-gray-600">Demandas Concluídas</p>
          </div>
          <span className="material-icons text-5xl" style={{ color: "#17eba0" }}>check_circle</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2" style={{ borderColor: "#ffbc44", height: "auto" }}>
          <div className="text-left">
            <h3 className="text-3xl font-bold">{andamneto}</h3>
            <p className="text-gray-600">Demandas em Andamento</p>
          </div>
          <span className="material-icons text-5xl" style={{ color: "#ffbc44" }}>pending</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2" style={{ borderColor: "#fc6161", height: "auto" }}>
          <div className="text-left">
            <h3 className="text-3xl font-bold">{atrasado}</h3>
            <p className="text-gray-600">Demandas Atrasadas</p>
          </div>
          <span className="material-icons text-5xl" style={{ color: "#fc6161" }}>warning</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2" style={{ borderColor: "#1c2c34", height: "auto" }}>
          <div className="text-left">
            <h3 className="text-3xl font-bold">{nao}</h3>
            <p className="text-gray-600">Não Iniciadas</p>
          </div>
          <span className="material-icons text-5xl" style={{ color: "#1c2c34" }}>schedule</span>
        </div>
      </div>
    </div>

    {/* Gráficos */}
    <div className="max-w-5xl mt-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Gráfico: Status de demandas */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-4">
          <h3 className="text-xl font-semibold text-center mt-4 mb-6">Status de demandas</h3>
          <canvas ref={doughnutChartRef} ></canvas>
        </div>

        {/* Gráficos: Demandante e Tempo Médio */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-center mb-4">Quantidade de demandas por demandante</h3>
            <canvas ref={demandanteChartRef} ></canvas>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-center mb-4">Tempo Médio por Demanda</h3>
            <canvas ref={barChartRef} ></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

 </div>
  </>
);

};

export default Dashboard;