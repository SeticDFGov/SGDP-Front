"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getItemById } from "@/app/projeto/services/projetoService";
import { getAllItems } from "@/app/projeto/services/etapaSevice";
import { getAllAnalise } from "@/app/projeto/services/analiseService"; // Certifique-se de importar o serviço
import 'material-icons/iconfont/material-icons.css';
import Header from "@/app/demandas/components/Header";
import { EtapaForm } from "@/app/projeto/components/EtapaForm";
import { AnaliseForm } from "@/app/projeto/components/AnaliseForm";
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // ✅ Importando automaticamente os módulos do Chart.js

export default function ProductPage() {
    const { id, nome } = useParams(); // Agora capturamos id e nome
    const [projeto, setProjeto] = useState({});
    const [etapas, setEtapas] = useState([]);
    const [etapaSelecionada, setEtapaSelecionada] = useState(null);
    const [analises, setAnalises] = useState([]);
    const [ultimaAnalise, setUltimaAnalise] = useState(null); // Armazenar a última análise
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    

const dataGraph = {
    labels: ["Planejado", "Executado"],
    datasets: [
      {
        label: "Valores",
        data: [30, 50],
        backgroundColor: ["#6366F1", "#0F9307"],
        borderColor: ["#4F46E5", "#D97706"],
        borderWidth: 1,
      },
    ],
  };

  // Configuração do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
    useEffect(() => {
        const fetchProjeto = async () => {
            const response = await getItemById(id);
            setProjeto(response);
        };
        fetchProjeto();
    }, [id]);

    useEffect(() => {
        const fetchEtapas = async () => {
            const response = await getAllItems(nome); // Agora usamos o nome
            setEtapas(response);
        };
        fetchEtapas();
    }, [nome]);

    useEffect(() => {
        if (etapaSelecionada) {
            const fetchAnalises = async () => {
                const analisesData = await getAllAnalise(etapaSelecionada.NM_ETAPA); // Supondo que o parâmetro seja o nome da etapa
                setAnalises(analisesData);
            };
            fetchAnalises();
        }
    }, [etapaSelecionada]);

    useEffect(() => {
        if (analises.length > 0) {
            // Ordena as análises pela data de criação e pega a mais recente
            const ultima = analises
                .sort((a, b) => new Date(b.Created) - new Date(a.Created))
                .shift(); // Pega a última análise
            setUltimaAnalise(ultima);
        }
    }, [analises]);

    const handleCadastroEtapa = (novaEtapa) => {
        // Adiciona a nova etapa à lista de etapas
        setEtapas((prevEtapas) => [...prevEtapas, novaEtapa]);
        setIsModalOpen(false); // Fecha o modal após o cadastro
    };

    return (
        <>
       <Header />
<div className="bg-gray-100 ">
    {/* Container Centralizado */}
    <div className="max-w-7xl mx-auto flex ">
        {/* Sidebar */}





        {/* Modal de cadastro */}
        <EtapaForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCadastroEtapa}
            nome_projeto={nome}
        />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 bg-white rounded-lg shadow-md">
            {/* Detalhes do Projeto */}
            <div className="p-6 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold mb-6">
        Informações sobre o projeto {projeto.NM_PROJETO}
      </h1>
      <div className="grid grid-cols-2 gap-10">
        {/* Informações do projeto */}
        <div className="space-y-4">
          <div>
            <p className="text-gray-800 font-semibold">Responsável pelo Projeto:</p>
            <p className="text-gray-600">{projeto.GERENTE_PROJETO}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Unidade:</p>
            <p className="text-gray-600">{projeto.UNIDADE}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Número do Processo SEI:</p>
            <p className="text-gray-600">{projeto.NR_PROCESSO_SEI}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Área Demandante:</p>
            <p className="text-gray-600">{projeto.NM_AREA_DEMANDANTE}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Ano:</p>
            <p className="text-gray-600">{projeto.ANO}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-64 w-full">
          <Bar data={dataGraph} options={options} />
        </div>
      </div>
    </div>
            <div>
                 <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                  <FaPlus className="text-blue-500 text-xl" />
                  <span className="text-gray-700">Inserir Etapa ao projeto</span>
              </div>
                <table className="w-full border-collapse border">
                          <thead>
                              <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">Nome da etapa</th>
                                  <th className="border p-2 text-left">Responsável pela Etapa</th>
                                  <th className="border p-2 text-left">Ínicio Planejado </th>
                                  <th className="border p-2 text-left">Termino Planejado</th>
                                  <th className="border p-2 text-left">Ínicio Real</th>
                                  <th className="border p-2 text-left">Termino Real</th>

                                  <th className="border p-2 text-left">Situação</th>
                                  <th className="border p-2 text-left">Ação</th>
                              </tr>
                          </thead>
                          <tbody>
                              {etapas.map((item) => (
                                  <tr key={item.ID} className="shadow">
                                      <td className="border p-2">{item.NM_ETAPA}</td>
                                      <td className="border p-2">{item.RESPONSAVEL_ETAPA}</td>
                                      <td className="border p-2">
                                        {(() => {
                                    try {
                                        const data = new Date(item.DT_INICIO_PREVISTO);
                                        if (isNaN(data)) throw new Error("Data inválida");
                                        return data.toLocaleDateString("pt-BR");
                                    } catch {
                                        return "";
                                    }
                                })()}
                                      </td>
                                      <td className="border p-2">

                                      {(() => {
                                    try {
                                        const data = new Date(item.DT_TERMINO_PREVISTO);
                                        if (isNaN(data)) throw new Error("Data inválida");
                                        return data.toLocaleDateString("pt-BR");
                                    } catch {
                                        return "";
                                    }
                                })()}  
                                      </td>
                
                                      <td className="border p-2">
                                        {(() => {
                                    try {
                                        const data = new Date(item.DT_INICIO_REAL);
                                        if (isNaN(data)) throw new Error("Data inválida");
                                        return data.toLocaleDateString("pt-BR");
                                    } catch {
                                        return "";
                                    }
                                })()}

                                      </td>
                                      <td className="border p-2">
                                    {(() => {
                                    try {
                                        const data = new Date(item.DT_TERMINO_REAL);
                                        if (isNaN(data)) throw new Error("Data inválida");
                                        return data.toLocaleDateString("pt-BR");
                                    } catch {
                                        return "";
                                    }
                                })()}
                                    </td>
                                     
                                  </tr>
                              ))}
                          </tbody>
                      </table>
            </div>

            {/* Detalhes da Etapa Selecionada */}
            {etapaSelecionada && (
                <div className="p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">
                        Detalhes sobre a etapa {etapaSelecionada.NM_ETAPA}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                        <div>
                            <p className="text-gray-800 font-semibold">Situação da Etapa:</p>
                            <p className="text-gray-600">{etapaSelecionada.SITUA_x00c7__x00c3_O}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">Responsável pela Etapa:</p>
                            <p className="text-gray-600">{etapaSelecionada.RESPONSAVEL_ETAPA}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">Início Previsto:</p>
                            <p className="text-gray-600">{etapaSelecionada.DT_INICIO_PREVISTO}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">Término Previsto:</p>
                            <p className="text-gray-600">{etapaSelecionada.DT_TERMINO_PREVISTO}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">Início Real:</p>
                            <p className="text-gray-600">{etapaSelecionada.DT_INICIO_REAL}</p>
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">Término Real:</p>
                            <p className="text-gray-600">{etapaSelecionada.DT_TERMINO_REAL}</p>
                        </div>
                    </div>

                    {/* Última Análise */}
                    {ultimaAnalise && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Última Análise</h3>
                            <p className="text-gray-800 font-semibold">Data de Criação:</p>
                            <p className="text-gray-600">
                                {(() => {
                                    try {
                                        const data = new Date(ultimaAnalise.Created);
                                        if (isNaN(data)) throw new Error("Data inválida");
                                        return data.toLocaleDateString("pt-BR");
                                    } catch {
                                        return "";
                                    }
                                })()}
                            </p>
                            <p className="text-gray-800 font-semibold">Análise:</p>
                            <p className="text-gray-600">{ultimaAnalise.ANALISE_ETAPA}</p>
                        </div>
                    )}

                    {/* Botão para abrir o modal */}
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-[rgb(15,147,7)] text-white rounded-md hover:bg-green-600"
                        >
                            Nova Análise de Desempenho
                        </button>
                    </div>

                    {/* Modal de cadastro de análise */}
                    <AnaliseForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                        etapaSelecionada={etapaSelecionada}
                    />
                </div>
            )}
        </main>
    </div>
</div>

        </>
    );
}
