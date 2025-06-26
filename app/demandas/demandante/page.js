"use client";

import { useEffect, useState } from "react";
import DemandanteForm from "../components/DemandanteForm";
import 'material-icons/iconfont/material-icons.css';
import Sidebar from "../components/SIdebar";
import { useDemandaApi } from "../hooks/demandaHook";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Demandante() {

  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {Token } = useAuth()
  const demandaApi = useDemandaApi();

  const handleDeleteItem = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esse demandante?");
    if (!confirmDelete) return;

    try {
      const response = await demandaApi.deleteDemandante(id);
      if (response) {
        alert("demandante excluída com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao excluir a demanda.");
      }
    } catch (error) {
      console.error("Erro ao excluir a demanda:", error);
      alert("Falha ao excluir a demanda.");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await demandaApi.getAllDemandantes();
      setItems(response);
    } catch (error) {
      console.error("Erro ao buscar demandantes:", error);
      setItems([]);
    }
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchItems(); 
  };

  useEffect(() => {
    fetchItems();
  }, [Token]);

  return (
    <PrivateRoute>

    
    <div className="text-black flex-1 flex flex-col ml-64">
     <Sidebar></Sidebar> 

      {/* Seção Principal */}
      <div class="flex-1 flex flex-col">
       <main class="flex-1 p-4 bg-white rounded-lg ">
       <div class="flex justify-between items-center mb-4">
                    <p class="text-gray-600">Resultados encontrados</p>
                    <div class="flex space-x-2">
                    <button class="border rounded-lg py-2 px-4 flex items-center bg-blue-800 text-white" onClick={() => setIsModalOpen(true)}>
                            <span class="material-icons mr-2" >add</span> Adicionar Demandante
                        </button>
                        <button class="border rounded-lg py-2 px-4">
                            <span class="material-icons">view_list</span>
                        </button>
                        <button class="border rounded-lg py-2 px-4">
                            <span class="material-icons">view_module</span>
                        </button>
                    </div>
                </div>
         
         

          {/* Modal */}
          {isModalOpen && <DemandanteForm onClose={handleCloseModal} />}
          
   <div className="flex gap-4 text-black">
  <div className="flex-1 overflow-x-auto mt-2">
    <div className="flex flex-col gap-4 mt-2 text-black">
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {items.map((item) => (
            <div
              key={item.AreaDemandanteID}
              className="rounded-lg p-4 shadow bg-white flex flex-col gap-2"
            >
              <div>
                <span className="text-gray-500 text-sm">Nome</span>
                <div className="text-gray-800 font-medium">{item.NM_DEMANDANTE}</div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Sigla</span>
                <div className="text-gray-800 font-medium">{item.NM_SIGLA}</div>
              </div>
              <div className="flex justify-end">
                <button
                  id="delete"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDeleteItem(item.AreaDemandanteID)}
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 border p-4 rounded-xl">
          Nenhum demandante encontrado
        </div>
      )}
    </div>
  </div>
</div>


        </main>
      </div>
    </div>
    </PrivateRoute>
  );
}
