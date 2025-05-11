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
    <div className="max-w-6xl mx-auto bg-white mt p-4 ">
      <div className="mb-6">
        <h2 className="text-4xl font-semibold text-black">
          Bem-vindo ao sistema de gestão de projetos da SETIC
        </h2>
      </div>

      
     

      <ProjetoForm onClose={handleCloseModal} isOpen={modalOpen} />
      <div className=" mb-6  justify-items-end">


{isAuthenticated && (
  <div
    onClick={handleOpenModal}
    className="cursor-pointer bg-[rgb(1,98,175,255)] hover:bg-[rgb(1,78,140)] text-white w-10 h-10 rounded-full hover:scale-105 flex items-center justify-center"
      title="Criar novo Projeto"
  >
    <FaPlus className="text-white text-lg"  />
  </div>
)}


</div>

      <div className="flex gap-4 text-black bg-white">
        <div className="flex-1 overflow-x-auto mt-2">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Nome do projeto</th>
                <th className="border p-2 text-left">Gerente do Projeto</th>
                <th className="border p-2 text-left">Número Processo SEI</th>
                <th className="border p-2 text-left">Unidade</th>
                <th className="border p-2 text-left">Área Demandante</th>
                <th className="border p-2 text-left">Ano</th>
                {isAuthenticated && <th className="border p-2 text-left">Ação</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.projetoId} className="shadow">
                  <td className="border p-2">{item.NM_PROJETO}</td>
                  <td className="border p-2">{item.GERENTE_PROJETO}</td>
                  <td className="border p-2">{item.NR_PROCESSO_SEI}</td>
                  <td className="border p-2">{item.UNIDADE}</td>
                  <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                  <td className="border p-2">{item.ANO}</td>
                  {isAuthenticated && (
                    <td className="border p-2 flex gap-2 justify-center">
                      <button
                        id="etapa"
                        className="button is-primary"
                        onClick={() => router.push(`/projeto/etapa/${item.projetoId}`)}
                      >
                        <span className="material-icons">sync</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination mx-auto mt-5 text-center">
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
</>

  );
}
