"use client"
import React, { useEffect, useState } from "react";
import { deleteItem, getAllItems, getQuantidade } from "./services/projetoService";
import Header from "../demandas/components/Header";
import ProjetoForm from "./components/ProjetoForm";
import 'material-icons/iconfont/material-icons.css';
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from "next/navigation";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { getAllEtapas, getSituacao, getTags } from "./services/etapaSevice";
import { optionsGraph } from "./components/config/config";
import Sidebar from "./components/Sidebar";

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
 
  <div className="bg-white flex-1 flex flex-col ml-64">
    <Sidebar></Sidebar> 

     <div class="flex-1 flex flex-col">
      <div className="flex-1 p-4 bg-white rounded-lg ">
        <div className="overflow-x-auto">
          <ProjetoForm onClose={handleCloseModal} isOpen={modalOpen} />

           <div class="flex justify-between items-center mb-4">
                    <p class="text-gray-600">Resultados encontrados</p>
                    <div class="flex space-x-2">
                        <button class="border rounded-lg py-2 px-4 flex items-center bg-blue-800 text-white" onClick={handleOpenModal}>
                            <span class="material-icons mr-2" >add</span> Adicionar Projeto
                        </button>
                    </div>
                </div>

          <table className="w-full border-collapse ">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left text-gray-600 p-3">Nome do projeto</th>
                <th className="text-left text-gray-600 p-3">Gerente do Projeto</th>
                <th className="text-left text-gray-600 p-3">Número Processo SEI</th>
                <th className="text-left text-gray-600 p-3">Unidade</th>
                <th className="text-left text-gray-600 p-3">Área Demandante</th>
                <th className="text-left text-gray-600 p-3">Ano</th>
                {isAuthenticated && <th className="p-3 text-left text-gray-600">Ação</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.projetoId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.NM_PROJETO}</td>
                  <td className="p-3">{item.GERENTE_PROJETO}</td>
                  <td className="p-3">{item.NR_PROCESSO_SEI}</td>
                  <td className="p-3">{item.UNIDADE}</td>
                  <td className="p-3">{item.NM_AREA_DEMANDANTE}</td>
                  <td className="p-3">{item.ANO}</td>
                  {isAuthenticated && (
                    <td className=" p-3">
                      <button
                        id="etapa"
                        className="button is-primary"
                        onClick={() => router.push(`/projeto/etapa/${item.projetoId}`)}
                      >
                        <span className="material-icons">chevron_right</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>   
    </div>
  </div>
</>

  );
}
