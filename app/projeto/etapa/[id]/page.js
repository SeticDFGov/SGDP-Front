"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import { EtapaForm } from "@/app/projeto/components/EtapaForm";
import AnaliseModal, { AnaliseForm } from "@/app/projeto/components/AnaliseForm";
import { FaTrash, FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { DesempenhoForm } from "@/app/projeto/components/DesempenhoForm";
import { CornerDownLeft } from "lucide-react";
import InicioEtapa from "../../components/InicioForm";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs'
import Sidebar from "../../components/Sidebar";
import utc from 'dayjs/plugin/utc';
import { useProjetoApi } from "../../hooks/projetoHook";
import { useAnaliseApi } from "../../hooks/analiseHook";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEtapaApi } from "../../hooks/etapaHook";
import DespachoModal from "../../components/DespachoModal";
dayjs.extend(utc);
export default function ProductPage() {
   const { id } = useParams();
  const router = useRouter();
  const { loading, isAuthenticated, Token } = useAuth();

  const [projeto, setProjeto] = useState({});
  const [etapas, setEtapas] = useState([]);
  const [unidade, setUnidade] = useState({})
  const [demandante, setDemandante] = useState({})
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [ultimaAnalise, setUltimaAnalise] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDesempenho, setShowDesempenho] = useState(false);
  const [showAnalise, setShowAnalise] = useState(false);
  const [exec, setExec] = useState(0);
  const [plan, setPlan] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const [showModalInicio, setShowModalInicio] = useState(false);
  const [showDespacho, setShowDespacho] = useState(false);
  const [despachoEtapa, setDespachoEtapa] = useState(null);

  const { getItemById } = useProjetoApi();
  const { getLastAnalise } = useAnaliseApi();
  const { getAllEtapas, getPercent, iniciarEtapa } = useEtapaApi();

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [loading, isAuthenticated, router]);

  // Carrega os dados do projeto e etapas
  useEffect(() => {
    const fetchData = async () => {
      if (!Token || !id || loading) return;

      try {
        const [projetoData, etapasData, percentData] = await Promise.all([
          getItemById(id),
          getAllEtapas(id),
          getPercent(id),
        ]);

        if (projetoData) setProjeto(projetoData);
        setDemandante(projetoData.AREA_DEMANDANTE)
        setUnidade(projetoData.Unidade)
        console.log(etapasData)
        console.log(projetoData)
        if (etapasData?.length) {
          const ordenadas = etapasData.sort((a, b) => a.Order - b.Order);
          setEtapas(ordenadas);
          console.log(ordenadas)
          const total = ordenadas.reduce(
            (soma, etapa) => soma + (etapa.PERCENT_TOTAL_ETAPA || 0),
            0
          );
          setOcupado(Math.round(total) > 99);
        }

        if (percentData) {
          setExec(percentData.PERCENT_EXECUTADO);
          setPlan(percentData.PERCENT_PLANEJADO);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do projeto:", error);
      }
    };

    fetchData();
  }, [id, Token, loading]);

  // Carrega última análise
  useEffect(() => {
    const fetchAnalise = async () => {
      if (!id || !Token || loading) return;

      try {
        const analise = await getLastAnalise(id);
        if (analise) setUltimaAnalise(analise);
      } catch (error) {
        console.error("Erro ao buscar última análise:", error);
      }
    };

    fetchAnalise();
  }, [id, Token, loading]);

  const handleCadastroEtapa = (novaEtapa) => {
    setEtapas((prev) => [...prev, novaEtapa]);
    setIsModalOpen(false);
  };

  // Função para iniciar etapa com confirmação
  const handleIniciarEtapa = async (etapa) => {
    const confirmar = window.confirm("Deseja realmente iniciar esta etapa?");
    if (!confirmar) return;
    const ok = await iniciarEtapa(etapa.EtapaProjetoId);
    if (ok) {
      // Recarrega etapas
      const etapasData = await getAllEtapas(id);
      if (etapasData?.length) {
        const ordenadas = etapasData.sort((a, b) => a.Order - b.Order);
        setEtapas(ordenadas);
      }
    } else {
      alert("Erro ao iniciar etapa.");
    }
  };

  const dataGraph = {
    labels: ["Planejado", "Executado"],
    datasets: [
      {
        label: "Valores",
        data: [plan, exec],
        backgroundColor: ["#6366F1", "#0F9307"],
        borderColor: ["#4F46E5", "#D97706"],
        borderWidth: 1,
        barThickness: 125,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };


  return (
    <>

<div className="bg-white flex-1 flex flex-col ml-64">
        <Sidebar></Sidebar>
        {/* Container Centralizado */}
        <div class="flex-1 flex flex-col">
        <div className="flex-1 p-4 bg-white rounded-lg ">
          {/* Sidebar */}
          <InicioEtapa
            isOpen={showModalInicio}
            onClose={() => setShowModalInicio(false)}
            etapa={etapaSelecionada}
          />
          <EtapaForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCadastroEtapa}
            id={id}
          />
          <DesempenhoForm
            isOpen={showDesempenho}
            onClose={() => setShowDesempenho(false)}
            etapa={etapaSelecionada}
          />
          <AnaliseModal
            isOpen={showAnalise}
            onClose={() => setShowAnalise(false)}
            nomeProjeto={id}
          />
          <DespachoModal
            isOpen={showDespacho}
            onClose={() => setShowDespacho(false)}
            projetoId={id}
            etapa={despachoEtapa}
          />
          {/* Conteúdo Principal */}
          <main className="overflow-x-auto">
            {/* Detalhes do Projeto */}
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-6">
               {projeto.NM_PROJETO}
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
                    <p className="text-gray-600">{unidade.Nome}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Número do Processo SEI:</p>
                    <p className="text-gray-600">{projeto.NR_PROCESSO_SEI}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Área Demandante:</p>
                    <p className="text-gray-600">{demandante.NM_DEMANDANTE}</p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">Última Ánalise:</p>
                    <p className="text-gray-600">{ultimaAnalise.ANALISE}</p>
                  </div>
                </div>

                {/* Gráfico */}
                <div className="h-64 w-full">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setShowAnalise(true);
                      }}
                      className="px-4 py-2 bg-[rgb(15,147,7)] text-white rounded-md"
                    >
                      Nova análise do projeto
                    </button>
                  </div>

                  <Bar className={"pt-10"} data={dataGraph} options={options} />
                </div>
              </div>
            </div>
            <div>
              {!ocupado && (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4"
                >
                  <FaPlus className="text-blue-500 text-xl" />
                  <span className="text-gray-700">Inserir Etapa ao projeto</span>
                </div>
              )}

              <table className="w-full border-collapse ">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className=" text-left text-gray-600 p-3">Nome da etapa</th>

                    <th className=" text-left text-gray-600 p-3">Ínicio Planejado </th>
                    <th className=" text-left text-gray-600 p-3">Termino Planejado</th>
                    <th className=" text-left text-gray-600 p-3">Ínicio Real</th>
                    <th className=" text-left text-gray-600 p-3">Termino Real</th>
                    <th className=" text-left text-gray-600 p-3">Situação</th>
                    <th className=" text-left text-gray-600 p-3">Planejado</th>
                    <th className=" text-left text-gray-600 p-3">Executado</th>
                    <th className=" text-left text-gray-600 p-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !Array.isArray(etapas) ? (
                      <tr className="border-b hover:bg-gray-50">
                        <td colSpan="100%" className="text-center p-4 text-gray-500">
                          Este projeto não contém etapas.
                        </td>
                      </tr>
                    ) : Array.isArray(etapas) &&
                    etapas
                      .slice()
                      .map((item) => (
                        <tr key={item.EtapaProjetoId} className="border-b hover:bg-gray-50">
                          <td className=" p-3">{item.NM_ETAPA}</td>
                          <td className=" p-3">
                            {
                              item.DT_INICIO_PREVISTO ?
                                new Date(item.DT_INICIO_PREVISTO).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_TERMINO_PREVISTO ?
                                new Date(item.DT_TERMINO_PREVISTO).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_INICIO_REAL ?
                                new Date(item.DT_INICIO_REAL).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_TERMINO_REAL ?
                                new Date(item.DT_TERMINO_REAL).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.SITUACAO
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.PERCENT_PLANEJADO.toFixed(2) + '%'
                            }
                          </td>
                          <td className=" p-3">
                            {
                             (item.PERCENT_EXEC_ETAPA != null ? item.PERCENT_EXEC_ETAPA.toFixed(2) + '%' : '0.00%')

                            }
                          </td>
                          <td className=" p-3">
                            {item.DT_INICIO_PREVISTO === null ? (
                              <button
                                onClick={() => { setEtapaSelecionada(item); setShowModalInicio(true); }}
                                className="px-4 py-2 rounded-md bg-green-500 text-white"
                                title="Iniciar Etapa"
                              >
                                <span className="material-icons">play_arrow</span>
                              </button>
                            ) : item.NM_ETAPA === "Despacho" ? (
                              <button
                                onClick={() => {
                                  setDespachoEtapa(item);
                                  setShowDespacho(true);
                                }}
                                className="px-4 py-2 rounded-md bg-yellow-500 text-white"
                                title="Despacho"
                              >
                                <span className="material-icons">gavel</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEtapaSelecionada(item);
                                  setShowDesempenho(true);
                                }}
                                className="px-4 py-2 rounded-md"
                                title="Aferir Etapa"
                              >
                                <span className="material-icons">sync</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
        </div>
      </div>

    </>
  );
}