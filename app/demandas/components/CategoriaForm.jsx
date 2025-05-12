"use client";

import React, { useState } from "react";
import { createCategoria } from "../services/categoriaService";

const CategoriaForm = ({ onClose }) => {
  const [categoria, setCategoria] = useState({
    Nome: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await createCategoria(categoria);
      setCategoria({ Nome: "" });
      onClose(); // Fecha o modal após sucesso
    } catch {
      setError("Erro no momento do cadastro da categoria");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Cadastro de Categoria
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          name="Nome"
          placeholder="Nome da categoria"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={categoria.Nome}
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

export default CategoriaForm;
