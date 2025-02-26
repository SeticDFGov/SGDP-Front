"use client";

import React, { useState } from "react";
import { createDemandante } from "../services/demandanteService";

const DemandanteForm = ({ onClose }) => {
  const [demandante, setDemandante] = useState({
    NM_DEMANDANTE: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await createDemandante(demandante);
      setDemandante({ NM_DEMANDANTE: "" });
      onClose(); // Fecha o modal após sucesso
    } catch {
      setError("Erro no momento do cadastro do demandante");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDemandante((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Cadastro de área Demandante
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          name="NM_DEMANDANTE"
          placeholder="Nome da área demandante"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={demandante.NM_DEMANDANTE}
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
  );
};

export default DemandanteForm;
