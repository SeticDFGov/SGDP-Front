"use client";

import React, { useEffect, useState } from "react";
import { createItem, fetchTemplates } from "../services/projetoService";

const ProjetoForm = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  const [projeto, setProjeto] = useState({
    NM_PROJETO: "",
    GERENTE_PROJETO: "",
    SITUACAO: "",
    UNIDADE: "",
    NR_PROCESSO_SEI: "",
    NM_AREA_DEMANDANTE: "",
    ANO: "2025",
    TEMPLATE: "",
    profiscoii: false,
    pdtiC2427: false,
    ptD2427: false

  });

  const unidadeSub = [
    'SUBINFRA',
    'SUBGD',
    'SUBSIS'
  ]

  const [error, setError] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createItem(projeto);

      
        

        setProjeto({
          NM_PROJETO: "",
          GERENTE_PROJETO: "",
          SITUACAO: "",
          UNIDADE: "",
          NR_PROCESSO_SEI: "",
          NM_AREA_DEMANDANTE: "",
          ANO: "2025",
          TEMPLATE: "",
          profiscoii: false,
          pdtiC2427: false,
          ptD2427: false
        });

        console.log("Cadastro realizado com sucesso!");
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unidade</label>
          <select
            name="UNIDADE"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={projeto.UNIDADE}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma Unidade</option>
            {unidadeSub.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
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
          <label className="block text-sm font-medium mb-1">Área Demandante</label>
          <select
            name="NM_AREA_DEMANDANTE"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            value={projeto.NM_AREA_DEMANDANTE}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma Área</option>
            <option value="UBDMO">UBDMO</option>
            <option value="URCA">URCA</option>
            <option value="USCD">USCD</option>
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
            <option value="">Selecione um Template</option>
            <option value="Projeto">Projeto</option>
            <option value="Contratação pregão">Contratação pregão</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="pdtiC2427"
                checked={projeto.pdtiC2427}
                onChange={handleChange}
              />
              <span>PDTIC 24/27</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="profiscoii"
                checked={projeto.profiscoii}
                onChange={handleChange}
              />
              <span>PROFISCO II</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                name="ptD2427"
                checked={projeto.ptD2427}
                onChange={handleChange}
              />
              <span>PTD 24/27</span>
            </label>
          </div>
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
}

export default ProjetoForm;
