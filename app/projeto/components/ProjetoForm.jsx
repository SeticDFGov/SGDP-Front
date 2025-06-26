"use client";

import React, { useEffect, useState } from "react";
import { useProjetoApi } from "../hooks/projetoHook";
import { getAllDemandantes } from "../../demandas/services/demandanteService";
import { useDemandaApi } from "@/app/demandas/hooks/demandaHook";
import { useAuth } from "@/app/contexts/AuthContext";
import { URL_AUTH_SERVICE, URL_ESTEIRA_SERVICE } from "@/app/consts/consts";

const templates = [
  "Projeto",
  "Contratação Pregão",
  "Contratação direta SUAG"
]

const ProjetoForm = ({ onClose, isOpen }) => {
  if (!isOpen) return null;
  const { createItem } = useProjetoApi();
  const demandaAPI = useDemandaApi();
  const user = useAuth()
  const [projeto, setProjeto] = useState({
    NM_PROJETO: "",
    GERENTE_PROJETO: "",
    SITUACAO: "",
    NR_PROCESSO_SEI: "",
    NM_AREA_DEMANDANTE: "",
    ANO: "2025",
    TEMPLATE: "",
    PROFISCOII: false,
    PDTIC2427: false,
    PTD2427: false,
    valorEstimado: "",
    UnidadeId: "",
    EsteiraId: ""
  });

  const [error, setError] = useState("");
  const [demandantes, setDemandantes] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [esteiras, setEsteiras] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    // Buscar áreas demandantes
    demandaAPI.getAllDemandantes().then(setDemandantes);
    // Buscar unidades
    fetch(`${URL_AUTH_SERVICE}/unidades`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(setUnidades);
    // Buscar esteiras
    fetch(`${URL_ESTEIRA_SERVICE}`, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(setEsteiras);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Montar o body conforme o novo modelo
      const body = {
        NM_PROJETO: projeto.NM_PROJETO,
        GERENTE_PROJETO: projeto.GERENTE_PROJETO,
        SITUACAO: projeto.SITUACAO,
        NR_PROCESSO_SEI: projeto.NR_PROCESSO_SEI,
        NM_AREA_DEMANDANTE: Number(projeto.NM_AREA_DEMANDANTE),
        ANO: projeto.ANO,
        TEMPLATE: projeto.TEMPLATE,
        PROFISCOII: Boolean(projeto.PROFISCOII),
        PDTIC2427: Boolean(projeto.PDTIC2427),
        PTD2427: Boolean(projeto.PTD2427),
        valorEstimado: Number(projeto.valorEstimado),
        UnidadeId: projeto.UnidadeId,
        EsteiraId: projeto.EsteiraId
      };
    
      await createItem(body);
      setProjeto({
        NM_PROJETO: "",
        GERENTE_PROJETO: "",
        SITUACAO: "",
        NR_PROCESSO_SEI: "",
        AreaDemandanteId: "",
        ANO: "2025",
        TEMPLATE: "",
        PROFISCOII: false,
        PDTIC2427: false,
        PTD2427: false,
        valorEstimado: "",
        UnidadeId: "",
        EsteiraId: ""
      });
      onClose();
      window.location.reload();
    } catch (error) {
      setError("Erro no momento do cadastro do Projeto");
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setProjeto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[700px] h-[90vh] overflow-y-auto flex flex-col">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Cadastro de Projeto</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-5 text-gray-700">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do Projeto</label>
            <input
              type="text"
              name="NM_PROJETO"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.NM_PROJETO}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gerente do Projeto</label>
            <input
              type="text"
              name="GERENTE_PROJETO"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.GERENTE_PROJETO}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Número do Processo SEI</label>
            <input
              type="text"
              name="NR_PROCESSO_SEI"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.NR_PROCESSO_SEI}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ano</label>
            <input
              type="text"
              name="ANO"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.ANO}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Área Demandante</label>
            <select
              name="NM_AREA_DEMANDANTE"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.NM_AREA_DEMANDANTE}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma Área</option>
              {demandantes.map((d) => (
                <option key={d.AreaDemandanteID} value={d.AreaDemandanteID}>{d.NM_DEMANDANTE}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unidade</label>
            <select
              name="UnidadeId"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.UnidadeId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma Unidade</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>{u.Nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Esteira</label>
            <select
              name="EsteiraId"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.EsteiraId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma Esteira</option>
              {esteiras.map((e) => (
                <option key={e.EsteiraId} value={e.EsteiraId}>{e.Nome.trim()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <select
              name="TEMPLATE"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.TEMPLATE}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma Esteira</option>
              {templates.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor Estimado</label>
            <input
              type="number"
              name="valorEstimado"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={projeto.valorEstimado}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="PDTIC2427"
                checked={projeto.PDTIC2427}
                onChange={handleChange}
              />
              <span>PDTIC 24/27</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="PROFISCOII"
                checked={projeto.PROFISCOII}
                onChange={handleChange}
              />
              <span>PROFISCO II</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="PTD2427"
                checked={projeto.PTD2427}
                onChange={handleChange}
              />
              <span>PTD 24/27</span>
            </label>
            
          </div>
          <div className="w-full flex justify-center gap-4 pt-6 border-t border-gray-200 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjetoForm;
