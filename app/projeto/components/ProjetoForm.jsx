"use client";

import React, { useEffect, useState } from "react";
import { createItem, fetchTemplates } from "../services/projetoService";
import { createEtapa } from "../services/etapaSevice";

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
    TEMPLATE: "", // Novo campo de template
  });

  const [error, setError] = useState("");
  const [etapas, setEtapas] = useState([]);

  useEffect(() => {
    if (projeto.TEMPLATE === "Contratação pregão") {
      const fetchData = async () => {
        try {
          const data = await fetchTemplates({ NM_TEMPLATE: "Contratação pregão" });
          setEtapas(data || []);
        } catch (err) {
          console.error("Erro ao buscar templates:", err);
          setEtapas([]);
        }
      };
      fetchData();
    } else {
      setEtapas([]); // Se mudar para outro template, limpar etapas
    }
  }, [projeto.TEMPLATE]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createItem(projeto);

      if (response) {
        if (projeto.TEMPLATE === "Contratação pregão" && etapas.length > 0) {
          for (const etapa of etapas) {
            await createEtapa({
              NM_ETAPA: etapa.NM_ETAPA,
              NM_PROJETO: projeto.NM_PROJETO, // ID do projeto recém-criado
              PERCENT_TOTAL_ETAPA: etapa.PERCENT_TOTAL,
            });
          }
        }

        setProjeto({
          NM_PROJETO: "",
          GERENTE_PROJETO: "",
          SITUACAO: "",
          UNIDADE: "",
          NR_PROCESSO_SEI: "",
          NM_AREA_DEMANDANTE: "",
          ANO: "2025",
          TEMPLATE: "",
        });

        console.log("Cadastro realizado com sucesso!");
        onClose();
        window.location.reload();
      } else {
        setError("Erro no momento do cadastro do Projeto");
      }
    } catch (error) {
      setError("Erro no momento do cadastro do Projeto");
      console.error("Erro ao enviar o formulário:", error);
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
      <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-[1250px] relative h-[400px] flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4 text-center">Cadastro de Projeto</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-center items-center space-y-4">
            <div className="grid grid-cols-3 gap-4 w-full">
              <input
                type="text"
                name="NM_PROJETO"
                placeholder="Nome do Projeto"
                className="w-full p-2 border border-gray-300 rounded mt-2 h-12"
                value={projeto.NM_PROJETO}
                onChange={handleChange}
              />

              <input
                type="text"
                name="GERENTE_PROJETO"
                placeholder="Gerente do Projeto"
                className="w-full p-2 border border-gray-300 rounded mt-2 h-12"
                value={projeto.GERENTE_PROJETO}
                onChange={handleChange}
              />

              <input
                type="text"
                name="UNIDADE"
                placeholder="Unidade"
                className="w-full p-2 border border-gray-300 rounded mt-2 h-12"
                value={projeto.UNIDADE}
                onChange={handleChange}
              />

              <input
                type="text"
                name="NR_PROCESSO_SEI"
                placeholder="Número do Processo SEI"
                className="w-full p-2 border border-gray-300 rounded mt-2 h-12"
                value={projeto.NR_PROCESSO_SEI}
                onChange={handleChange}
              />

              <input
                type="text"
                name="NM_AREA_DEMANDANTE"
                placeholder="Área Demandante"
                className="w-full p-2 border border-gray-300 rounded mt-2 h-12"
                value={projeto.NM_AREA_DEMANDANTE}
                onChange={handleChange}
              />

              <div>
                <label className="block mb-2">Template:</label>
                <select
                  name="TEMPLATE"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  value={projeto.TEMPLATE}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um template</option>
                  <option value="Desenvolvimento">Desenvolvimento</option>
                  <option value="Contratação pregão">Contratação pregão</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
            </div>

            <div className="w-full flex justify-end space-x-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjetoForm;
