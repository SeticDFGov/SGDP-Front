"use client";

import { useEffect, useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import { deleteCategoria, getAllCategoria } from "../services/categoriaService";
import CategoriaForm from "../components/CategoriaForm";
import Header from "../components/Header";

export default function Demandante() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica se o código está rodando no lado do cliente
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      setIsAuthenticated(authStatus === "true");

      // Se o usuário não estiver autenticado, redireciona para a página de login
      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]); 

 


  const handleDeleteItem = async (id) => {
  // Exibe um alerta de confirmação
  const confirmDelete = window.confirm("Tem certeza que deseja excluir essa categoria?");
  
  if (!confirmDelete) return;

  try {
    const response = await deleteCategoria(  id);

    if (response) {
      alert("categoria excluída com sucesso!");
      window.location.reload(); // Recarrega a página após a exclusão
    } else {
      alert("Erro ao excluir a categoria.");
    }
  } catch (error) {
    console.error("Erro ao excluir a categoria:", error);
    alert("Falha ao excluir a categoria.");
  }
};
  // Função para buscar demandantes
  const fetchItems = async () => {
    try {
      const response = await getAllCategoria();
      setItems(response);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setItems([]); // Evita que a tabela quebre caso ocorra erro na API
    }
  };

  // Fechar modal e atualizar lista após cadastro
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchItems(); // Recarrega os dados
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="text-black">
        <Header></Header> 

      {/* Seção Principal */}
      <div className="mx-auto bg-white mt-5">
        <div className="p-4 max-w-6xl mx-auto bg-white mt-5 mb-5">
          <div className="max-w-6xl mx-auto mt p-4">
            <div className="mt-5 flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Quadro de Categorias</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-1/4 bg-gray-900 text-white py-2 rounded hover:scale-105"
              >
                Nova Categoria
              </button>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && <CategoriaForm onClose={handleCloseModal} />}

          {/* Tabela */}
          <div className="flex gap-4">
            <div className="flex-1 overflow-x-auto mt-2 p-4">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Nome</th>
                    <th className="border w-20 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.CategoriaId} className="shadow">
                        <td className="border p-2">{item.Nome}</td>
                        <td className="border p-2">
                          <div className="flex justify-center items-center gap-2">
                            <button id="delete" className="text-gray-900 hover:scale-105" onClick={() => {handleDeleteItem(item.CategoriaId)}}>
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="border p-4 text-center text-gray-500">
                        Nenhuma categoria encontrada                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Paginação */}
              <div className="pagination mx-auto mt-5 text-center">
                <button id="prev" className="button is-primary">
                  <span className="material-icons">chevron_left</span>
                </button>
                <button id="next" className="button is-primary">
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
