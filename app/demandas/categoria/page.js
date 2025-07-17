"use client";

import { useEffect, useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import CategoriaForm from "../components/CategoriaForm";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SIdebar";
import { useDemandaApi } from "../hooks/demandaHook";
import { useAuth } from "@/app/contexts/AuthContext";

export default function CategoriaPage() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { Token } = useAuth();
  const demandaApi = useDemandaApi();
  if (!Token) {
    return <div>Carregando...</div>;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      setIsAuthenticated(authStatus === "true");
      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]);

  const handleDeleteItem = async (id) => {
    if (!Token) return;
    const confirmDelete = window.confirm("Tem certeza que deseja excluir essa categoria?");
    if (!confirmDelete) return;
    try {
      const response = await demandaApi.deleteCategoria(id);
      if (response) {
        alert("categoria excluída com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao excluir a categoria.");
      }
    } catch (error) {
      console.error("Erro ao excluir a categoria:", error);
      alert("Falha ao excluir a categoria.");
    }
  };

  const fetchItems = async () => {
    if (!Token) return;
    try {
      const response = await demandaApi.getAllCategoria();
      setItems(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setItems([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchItems();
  };

  useEffect(() => {
    if (Token) fetchItems();
  }, [Token]);

  return (
    <div className="text-black flex-1 flex flex-col ml-64">
      <Sidebar></Sidebar>
      <div class="flex-1 flex flex-col">
        <main class="flex-1 p-4 bg-white rounded-lg ">
          <div class="flex justify-between items-center mb-4">
            <p class="text-gray-600">Resultados encontrados</p>
            <div class="flex space-x-2">
              <button class="border rounded-lg py-2 px-4 flex items-center bg-blue-800 text-white" onClick={() => setIsModalOpen(true)}>
                <span class="material-icons mr-2" >add</span> Adicionar Tipo
              </button>
              <button class="border rounded-lg py-2 px-4">
                <span class="material-icons">view_list</span>
              </button>
              <button class="border rounded-lg py-2 px-4">
                <span class="material-icons">view_module</span>
              </button>
            </div>
          </div>
          {isModalOpen && <CategoriaForm onClose={handleCloseModal} />}
          <div className="flex gap-4 text-black">
            <div className="flex-1 overflow-x-auto mt-2">
              <div className="flex flex-col gap-4 mt-2 text-black">
                {items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {items.map((item) => (
                      <div key={item.CategoriaId} className=" rounded-lg p-4 shadow bg-white flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{item.Nome}</span>
                        <button
                          id="delete"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleDeleteItem(item.CategoriaId)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 border p-4 rounded-xl">
                    Nenhuma categoria encontrada
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
