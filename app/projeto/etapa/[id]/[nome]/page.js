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

export default function ProductPage() {
    const { id, nome } = useParams(); // Agora capturamos id e nome
    const [projeto, setProjeto] = useState({});
    const [etapas, setEtapas] = useState([]);
    const [etapaSelecionada, setEtapaSelecionada] = useState(null);
    const [analises, setAnalises] = useState([]);
    const [ultimaAnalise, setUltimaAnalise] = useState(null); // Armazenar a última análise
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

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
<div className="bg-gray-100 h-screen">
    {/* Container Centralizado */}
    <div className="max-w-7xl mx-auto flex ">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-lg p-4 flex flex-col justify-between h-[850px]">
    <div>
        <h2 className="text-lg font-semibold mb-4">Etapas</h2>
        <ul className="space-y-2">
            {etapas.map((etapa) => (
                <li
                    key={etapa.ID}
                    className={`cursor-pointer p-2 rounded-md ${
                        etapaSelecionada?.ID === etapa.ID
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => setEtapaSelecionada(etapa)}
                >
                    {etapa.NM_ETAPA}
                </li>
            ))}
        </ul>
    </div>
    <button
        onClick={() => setIsModalOpen(true)}
        className="mt-auto w-full py-2 bg-[rgb(15,147,7)] text-white rounded-md hover:bg-green-600"
    >
        Cadastrar Etapa
    </button>
</aside>


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
                <h1 className="text-2xl font-bold mb-6">Informações sobre o projeto {projeto.NM_PROJETO}</h1>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
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
