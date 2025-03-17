"use client"
import React, { useEffect, useState } from "react";
import { deleteItem, getAllItems } from "./services/projetoService";
import Header from "../demandas/components/Header";
import ProjetoForm from "./components/ProjetoForm";
import 'material-icons/iconfont/material-icons.css';
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";

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
  LineElement
);

export default function Projetos () {

  const [data, setData] = useState([]);
  const [modalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
      const handleItens = async () => {
          const response = await getAllItems();
          setData(response);
      };
      handleItens();
  }, []);

  const handleDeleteItem = async (id) => {
      const confirmDelete = window.confirm("Tem certeza que deseja excluir esse projeto?");
      if (!confirmDelete) return;

      try {
          const response = await deleteItem(id);
          if (response) {
              alert("Projeto excluído com sucesso!");
              window.location.reload();
          } else {
              alert("Erro ao excluir o projeto.");
          }
      } catch (error) {
          console.error("Erro ao excluir o projeto:", error);
          alert("Falha ao excluir o projeto.");
      }
  };

  useEffect(() => {
      const authStatus = localStorage.getItem("authenticated") === "true";
      setIsAuthenticated(authStatus);
  }, []);

  // Dados fictícios para os gráficos
  const barData = {
      labels: ["Concluído", "Em Andamento", "Cancelado"],
      datasets: [
          {
              label: "Projetos",
              data: [10, 5, 2],
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
          }
      ]
  };

  const pieData = {
      labels: ["TI", "RH", "Financeiro", "Marketing"],
      datasets: [
          {
              data: [4, 3, 2, 1],
              backgroundColor: ["#2196F3", "#FF5722", "#8BC34A", "#9C27B0"],
          }
      ]
  };

  const lineData = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
      datasets: [
          {
              label: "Projetos Criados",
              data: [1, 3, 2, 5, 4],
              borderColor: "#FF9800",
              borderWidth: 2,
              fill: false,
          }
      ]
  };

  return (
      <>
          <div className="bg-white">
              <Header />
            <div className="max-w-6xl mx-auto bg-white mt p-4 ">

            
              <div className="mb-6 pt-10 pb-20">
                <h2 className="text-4xl font-semibold text-black ">Bem-vindo ao sistema de gestão de projetos da SUBTDCR</h2>
            </div>
              <ProjetoForm onClose={handleCloseModal} isOpen={modalOpen} />

              {/* Container dos gráficos ocupando toda a largura */}
              <div className="grid grid-cols-3 gap-4 w-full px-4 pb-20">
                  <div className="h-40">
                      <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="h-40">
                      <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="h-40">
                      <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
              </div>

              <div onClick={handleOpenModal} className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                  <FaPlus className="text-blue-500 text-xl" />
                  <span className="text-gray-700">Inserir Projeto</span>
              </div>

              <div className="flex gap-4 text-black bg-white">
                  <div className="flex-1 overflow-x-auto mt-2">
                      <table className="w-full border-collapse border">
                          <thead>
                              <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">Nome do projeto</th>
                                  <th className="border p-2 text-left">Gerente do Projeto</th>
                                  <th className="border p-2 text-left">Situação</th>
                                  <th className="border p-2 text-left">Unidade</th>
                                  <th className="border p-2 text-left">Número do processo SEI</th>
                                  <th className="border p-2 text-left">Área Demandante</th>
                                  <th className="border p-2 text-left">Ano</th>
                                  {isAuthenticated && (<th className="border p-2 text-left">Ação</th>)}
                              </tr>
                          </thead>
                          <tbody>
                              {data.map((item) => (
                                  <tr key={item.ID} className="shadow">
                                      <td className="border p-2">{item.NM_PROJETO}</td>
                                      <td className="border p-2">{item.GERENTE_PROJETO}</td>
                                      <td className="border p-2">{item.SITUACAO}</td>
                                      <td className="border p-2">{item.UNIDADE}</td>
                                      <td className="border p-2">{item.NR_PROCESSO_SEI}</td>
                                      <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                                      <td className="border p-2">{item.ANO}</td>
                                      {isAuthenticated && (
                                          <td className="border p-2 flex gap-2 justify-center">
                                              <>
                                                  <button
                                                      className="text-red-500 hover:text-red-700"
                                                      onClick={() => handleDeleteItem(item.ID)}
                                                  >
                                                      <FaTrash />
                                                  </button>
                                                  <button id="etapa" className="button is-primary"
                                                      onClick={() => router.push(`/projeto/etapa/${item.ID}/${item.NM_PROJETO}`)}
                                                  >
                                                      <span className="material-icons">sync</span>
                                                  </button>
                                              </>
                                          </td>
                                      )}
                                  </tr>
                              ))}
                          </tbody>
                      </table>

                      <div className="pagination mx-auto mt-5" style={{ textAlign: "center" }}>
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
