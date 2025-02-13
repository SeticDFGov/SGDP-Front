"use client";

import React, { useEffect, useState } from "react";
import { getAllItems, createItem, updateItem, deleteItem } from "./services/apiService";
import Modal from "./components/Modal";
import Dropdown from "./components/Dropdown";
import SearchField from "./components/Search";

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
      <header className=" text-white bg-gray-800 py-4 px-6 rounded-lg shadow-lg flex items-center justify-between">
        <img src="/header.png" width={75} height={75} alt="imagem"></img>
        <h1 className="text-lg">Transformação Digital</h1>
        <button
          className="bg-gray-800 text-white px-4 py-2  border rounded  border-white"
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
      <div className="flex justify-between space-x-2 pt-10">
          <Dropdown name={"Selecione uma Categoria"}>
             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 1</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 2</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 3</li>
          </Dropdown>
          <Dropdown name={"Selecione a unidade"}>
             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 1</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 2</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 3</li>
          </Dropdown>
          <Dropdown name={"Selecione o status"}>
             <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 1</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 2</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Opção 3</li>
          </Dropdown>
          <SearchField></SearchField>
      </div>

      {/* Exibição dos Itens - divs ao invés de tabela */}
      <div className="pt-10 text-black">

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Nome Demanda</th>
                <th className="border p-2">Data de Abertura</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Categoria</th>
                <th className="border p-2">Demandante</th>
                <th className="border p-2">Data da Conclusão</th>
                <th className="border p-2">Responsável</th>
                <th className="border p-2">Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.nomeDemanda}</td>
                  <td className="border p-2">{item.dataAbertura}</td>
                  <td className="border p-2">{item.status}</td>
                  <td className="border p-2">{item.categoria}</td>
                  <td className="border p-2">{item.POCENTRAL}</td>
                  <td className="border p-2">{item.dataConcl}</td>
                  <td className="border p-2">{item.POSUBTDCR}</td>
                  <td className="border p-2">{item.detalhes}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
