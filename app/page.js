"use client";

import React, { useEffect, useState } from "react";
import { getAllItems, createItem, updateItem, deleteItem } from "./services/apiService";
import Modal from "./components/Modal";

const Home = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ nomeDemanda: "", statusDemanda: "" });
  const [isLoading, setIsLoading] = useState(false); // Para controle de carregamento

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await getAllItems();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar itens", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createItem({ ...newItem });
      fetchItems();
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar item", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await updateItem(selectedItem.id, { fields: newItem });
      fetchItems();
      setModalOpen(false);
    } catch (error) {
      console.error("Erro ao editar item", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error("Erro ao excluir item", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white h-screen">
      <header className="bg-white text-black py-4 px-6 rounded-lg shadow-lg flex items-center justify-between">
        <h1 className="text-3xl font-semibold">SUBTDCR</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
          onClick={() => {
            setNewItem({ nomeDemanda: "", statusDemanda: "" });
            setModalOpen(true);
          }}
        >
          Acesso Interno
        </button>
      </header>

      {/* Mensagem de boas-vindas */}
      <div className="mt-8 mb-6 text-center text-xl font-semibold text-gray-700">
        Bem-vindo ao controle de demandas da SUBTDCR
      </div>

      {/* Exibição dos Itens - divs ao invés de tabela */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          items.map((item) => (
            <div
              key={item.ID}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold">{item.nomeDemanda}</span>
                <span>{item.statusDemanda}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                  onClick={() => {
                    setSelectedItem(item);
                    setNewItem(item.fields);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(item.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para criar ou editar item */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={selectedItem ? "Editar Demanda" : "Criar Demanda"}>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Nome da Demanda"
            value={newItem.nomeDemanda}
            onChange={(e) => setNewItem({ ...newItem, nomeDemanda: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            placeholder="Status"
            value={newItem.statusDemanda}
            onChange={(e) => setNewItem({ ...newItem, statusDemanda: e.target.value })}
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={selectedItem ? handleEdit : handleCreate}
          >
            {selectedItem ? "Salvar Alterações" : "Criar"}
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Home;
