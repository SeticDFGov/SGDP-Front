"use client"
import React, { useEffect, useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from "next/navigation";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { getAllEtapas, getSituacao, getTags } from "../services/etapaSevice";
import { getAllItems } from "../services/projetoService";
import { getQuantidade } from "../services/projetoService";
import { optionsGraph } from "../components/config/config";
import Sidebar from "../components/Sidebar";

// Registrando os componentes necessários do Chart.js
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

export default function Projetos () {

  const [data, setData] = useState([]);
  const [modalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [chartData, setChartData] = useState({});
  const [chartData2, setChartData2] = useState({});
  const [ total, setTotal] = useState({});
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);


  useEffect(() => {
    // Verifica se o código está rodando no lado do cliente
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      setIsAuthenticated(authStatus === "true");

      // Se o usuário não estiver autenticado, redireciona para a página de login
      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]);
  useEffect(() => {
      const handleItens = async () => {
          const response = await getAllItems();
          setData(response);
        
      };
      handleItens();
  }, []);


  useEffect(() => {
      const authStatus = localStorage.getItem("authenticated") === "true";
      setIsAuthenticated(authStatus);
  }, []);

  // Dados fictícios para os gráficos
 useEffect(() => {
        const fetchProjetos = async () => {
          const data = await getSituacao();
          const data2 = await getTags();
          const data3 = await getQuantidade();
          setTotal(data3)
          setChartData(data)
          setChartData2(data2)
         };
        fetchProjetos();
    }, [data]);

   const doughnutData = {
    labels: ["Concluído", "Em Andamento", "Atrasado", "Não iniciado"],
    datasets: [
        {
            label: "Projetos",
            data: [
                chartData.Concluido,
                chartData.EmAndamento,
                chartData.Atrasado,
                chartData.NaoIniciado
            ],
            backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#000000"],
        }
    ]
};


    const combinedData = [
    { label: "PTD24/27", value: chartData2.PTD2427 },
    { label: "PTDIC24/27", value: chartData2.PDTIC2427 },
    { label: "PROFISCOII", value: chartData2.PROFISCOII }
];

combinedData.sort((a, b) => b.value - a.value);

const sortedLabels = combinedData.map(item => item.label);
const sortedValues = combinedData.map(item => item.value);

const barTags = {
    labels: sortedLabels,
    datasets: [
        {
            label: "Projetos",
            data: sortedValues,
            backgroundColor: ["#000000", "#000000", "#000000"]
        }
    ]
};




  return (
<>
 
   <main className="flex-1 p-4 bg-white rounded-lg shadow flex flex-col ml-64">
    <Sidebar></Sidebar> 
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

      <div className="flex flex-wrap justify-center gap-4 mt-8 text-black pb-10">
        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "purple", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">{total.SUBTDCR}</h3>
            <p className="text-gray-600">Projetos SUBGD</p>
          </div>
        </div>

        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "green", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">{total.SUBSIS}</h3>
            <p className="text-gray-600">Projetos SUBSIS</p>
          </div>
        </div>

        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "orange", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">{total.SUBINFRA}</h3>
            <p className="text-gray-600">Projetos SUBINFRA</p>
          </div>
        </div>
      </div>
    </div>

    {/* Gráficos */}
    <div className="max-w-5xl mt-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Gráfico: Status de demandas */}
        
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-4 ">
        <h3 className="text-xl font-semibold text-center mb-4">Situação dos Projetos</h3>
        
          <Doughnut data={doughnutData} options={{ responsive: true ,plugins: {
     legend: {
          display: true,
          position: "bottom",
        },
    },}} />
        </div>

        {/* Gráficos: Demandante e Tempo Médio */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-4">
          <div className="mb-6 h-full">
            <h3 className="text-xl font-semibold text-center mb-4">Tags dos Projetos</h3>
            <Bar data={barTags} options={optionsGraph} plugins={[ChartDataLabels]} />
          </div>
        
        </div>
      </div>
    </div>
  </div>
</main>

</>

  );
}
