"use client"
import { useState, useEffect, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import Modal from "./components/Modal";
import CadastroDemanda from "./components/DemandaForm";
import EditFormModal from "./components/EditDemandaForm";
import DemandDetailsModal from "./components/Detalhamento";
import Sidebar from "./components/SIdebar";
import { useDemandaApi } from "./hooks/demandaHook";
import { useAuth } from "@/app/contexts/AuthContext";


const Dashboard = () => {
  const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nao, setNao] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false)
    const [nomeId, setNomeId] = useState(null)
    const [tmp, setTmp] = useState({})
    const [detail, setDetail] = useState(null)
    const [demandante1, setDemandantes] = useState([])
    const [siglasMap, setSiglasMap] = useState([])
    const { getAllDemandantes, getAllDemandas, deleteDemanda } = useDemandaApi();
   const handleOpenEditModal = (id) => {
    setSelectedItemId(id);
    setIsModalEditOpen(true);
    };

    const handleCloseEditModal = () => {
    setIsModalEditOpen(false);
    setSelectedItemId(null);
    };
   const handleOpenDetailModal = (id, item) => {
    console.log(id)
    setDetail(item)
    setNomeId(id);
    setIsModalDetailOpen(true);
  };

  const handleCloseDetailModal = () => {
    // Verifique se o modal está aberto antes de tentar fechá-lo
    if (isModalDetailOpen) {
      setIsModalDetailOpen(false);
      setNomeId(null);
    }
  };
    const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
    const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      console.log(`Excluindo item com ID: ${id}`);
     
    }
  };

    useEffect(() => {
    const authStatus = localStorage.getItem("authenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);



   

    const handleTmpAVG = async () => {
    setIsLoading(true);
    try {
      const data = await tmpAVG();

      setTmp(data);

    } catch (error) {
        console.error("Erro ao buscar itens", error);
    } finally {
        setIsLoading(false);
    }
  };



  const handleDeleteItem = async (id) => {
 
  const confirmDelete = window.confirm("Tem certeza que deseja excluir esta demanda?");

  if (!confirmDelete) return;

  try {
    const response = await deleteDemanda(id);

    if (response) {
      alert("demanda excluída com sucesso!");
      window.location.reload(); // Recarrega a página após a exclusão
    } else {
      alert("Erro ao excluir a demanda.");
    }
  } catch (error) {
    console.error("Erro ao excluir a demanda:", error);
    alert("Falha ao excluir a demanda.");
  }
};

    const fetchItems = async () => {
    setIsLoading(true);
    try {
        const data = await getAllDemandas();


        if (!Array.isArray(data)) {
        console.warn("O retorno da API não é um array:", data);
        setItems([]);
        return;
        }

        setItems(data);
    } catch (error) {
        console.error("Erro ao buscar itens", error);
    } finally {
        setIsLoading(false);
    }
  };

useEffect(() => {
  fetchItems();
}, []);
useEffect(() => {
    handleTmpAVG();
  }, []);
const [isDataLoaded, setIsDataLoaded] = useState(false);

useEffect(() => {
  const fetchDemandantes = async () => {
    try {
      const response = await getAllDemandantes();
  

      if (!Array.isArray(response)) {
        console.error("Erro: A resposta da API não é um array!");
        return;
      }

      setDemandantes(response);

      const newSiglasMap = {};
      response.forEach((item) => {
        if (item.NM_DEMANDANTE && item.NM_SIGLA) {
          newSiglasMap[item.NM_DEMANDANTE] = item.NM_SIGLA;
        }
      });

    
      setSiglasMap(newSiglasMap);
      setIsDataLoaded(true); 

    } catch (error) {
      console.error("Erro ao buscar demandantes:", error);
    }
  };

  fetchDemandantes();
}, []);

const { Token } = useAuth();
if (!Token) {
  return <div>Carregando...</div>;
}


return (
  <>


    <div className="bg-white bg-white flex-1 flex flex-col ml-64">
      <Sidebar></Sidebar>
      <div class="flex-1 flex flex-col">
        <main class="flex-1 p-4 bg-white rounded-lg ">
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <CadastroDemanda onClose={handleCloseModal} ></CadastroDemanda>
          </Modal>
          <Modal isOpen={isModalEditOpen} onClose={handleCloseEditModal}>
            <EditFormModal itemId={selectedItemId} onClose={handleCloseEditModal}></EditFormModal>
          </Modal>
          <DemandDetailsModal isOpen={isModalDetailOpen} onClose={handleCloseDetailModal} demandaId={nomeId} item={detail}>
          </DemandDetailsModal>
          <div class="flex justify-between items-center mb-4">
            <p class="text-gray-600">Resultados encontrados</p>
            <div class="flex space-x-2">
              <button class="border rounded-lg py-2 px-4 flex items-center bg-blue-800 text-white" onClick={handleOpenModal}>
                <span class="material-icons mr-2" >add</span> Adicionar Demanda
              </button>

            </div>
          </div>
          <div className="flex gap-4 text-black">
            <div className="flex-1 overflow-x-auto mt-2">
              <table className="w-full border-collapse ">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className=" p-3 text-left text-gray-600">Nome Demanda</th>
                    <th className=" p-3 text-left text-gray-600">Data de Abertura</th>
                    <th className=" p-3 text-left text-gray-600">Situação</th>
                    <th className=" p-3 text-left text-gray-600">Tipo</th>
                    <th className=" p-3 text-left text-gray-600">Área Demandante</th>
                    {isAuthenticated && <th className=" p-3 text-left text-gray-600">Responsável</th>
                    }
                    <th className=" p-3 text-left text-gray-600">Data da Conclusão</th>
                    <th className=" p-3 text-left text-gray-600">Unidade SUBTDCR</th>
                    {isAuthenticated && <th className=" p-3 text-left text-gray-600">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.ID} className="border-b">
                      <td className=" p-3">{item.NM_DEMANDA}</td>
                      <td className=" p-3">
                        {
                          (() => {
                            try {
                              const date = new Date(item.DT_ABERTURA);
                              return new Intl.DateTimeFormat("pt-BR", {
                                timeZone: "UTC"
                              }).format(date);
                            } catch {
                              return "";
                            }
                          })()

                        }
                      </td>
                      <td className=" p-3">{item.STATUS}</td>
                      <td className=" p-3">{item.CATEGORIA}</td>
                      <td className=" p-3">{item.NM_AREA_DEMANDANTE}</td>
                      {isAuthenticated && <td className="p-3">{item.NM_PO_SUBTDCR}</td>
                      }
                      <td className="p-3">
                        {
                          (() => {
                            try {
                              const data = new Date(item.DT_CONCLUSAO);

                              // Verifica se a data é inválida ou se é 31/12/1969
                              if (isNaN(data) || data.toDateString() === new Date(0).toDateString()) {
                                throw new Error("Data inválida");
                              }

                              return data.toLocaleDateString("pt-BR");
                            } catch {
                              return "";
                            }
                          })()

                        }
                      </td>
                      <td className="p-3">{item.UNIDADE}</td>
                      {isAuthenticated && (
                        <td className="p-3 justify-center gap-2">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => { handleOpenDetailModal(item.ID, item); setNomeId(item.NM_DEMANDA); }}
                            >
                              <span className="material-icons">visibility</span>
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleDeleteItem(item.ID)}
                            >
                              <span className="material-icons">delete</span>
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => handleOpenEditModal(item.ID)}
                            >
                              <span className="material-icons">arrow_forward_ios</span>
                            </button>
                          </div>

                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

          </div>

        </main>
      </div>
    </div>

  </>
);

};

export default Dashboard;