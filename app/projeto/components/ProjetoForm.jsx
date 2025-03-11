"use client";

import React, { useState } from "react";
import { createItem } from "../services/projetoService";

const ProjetoForm = ({ onClose, isOpen }) => {
if (!isOpen) return null;

  const [projeto, setProjeto] = useState({
    NM_PROJETO: "",
    GERENTE_PROJETO:"",
    SITUACAO:"",
    UNIDADE:"",
    NR_PROCESSO_SEI:"",
    NM_AREA_DEMANDANTE:"",
    ANO:""
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await createItem(demandante);
      setProjeto({ 
        NM_PROJETO: "",
        GERENTE_PROJETO:"",
        SITUACAO:"",
        UNIDADE:"",
        NR_PROCESSO_SEI:"",
        NM_AREA_DEMANDANTE:"",
        ANO:""
});
      onClose(); // Fecha o modal após sucesso
    } catch {
      setError("Erro no momento do cadastro do Projeto");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjeto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
    
 
            
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Cadastro de Projeto
                </h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <input
                    type="text"
                    name="NM_PROJETO"
                    placeholder="Nome do Projeto"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.NM_PROJETO}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="GERENTE_PROJETO"
                    placeholder="Gerente do Projeto"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.GERENTE_PROJETO}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="SITUACAO"
                    placeholder="Situação"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.SITUACAO}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="UNIDADE"
                    placeholder="Unidade"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.UNIDADE}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="NR_PROCESSO_SEI"
                    placeholder="Número do Processo SEI"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.NR_PROCESSO_SEI}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="NM_AREA_DEMANDANTE"
                    placeholder="Área Demandante"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.NM_AREA_DEMANDANTE}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="ANO"
                    placeholder="Ano"
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                    value={projeto.ANO}
                    onChange={handleChange}
                />

                <button
                    className="w-full bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-600"
                    onClick={handleSubmit}
                >
                    Cadastrar
                </button>
            </div>
        </div>
        </> 
  );
};

export default ProjetoForm;
