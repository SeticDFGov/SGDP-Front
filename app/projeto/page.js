"use client"
import React, { useEffect, useState } from "react";
import { getAllItems } from "./services/projetoService";
import Header from "../demandas/components/Header";
import ProjetoForm from "./components/ProjetoForm";
import 'material-icons/iconfont/material-icons.css';
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';

export default function Projetos () {

const [data, setData] = useState([])
const [modalOpen, setIsModalOpen] = useState(false)

const handleOpenModal = () => {
    setIsModalOpen(true);
  };


 const handleCloseModal = () => setIsModalOpen(false);
useEffect(() => {
    const handleItens = async() =>{
        const response = await getAllItems();
        setData(response)
    }; handleItens()
},[])




return (
 <>
 <div className="bg-white">

 <Header/>
<ProjetoForm onClose={handleCloseModal} isOpen={modalOpen} ></ProjetoForm>

 <div onClick={() => handleOpenModal()} className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <FaPlus className="text-blue-500 text-xl" />
            <span className="text-gray-700">Inserir Projeto</span>
</div>

 <div className="flex gap-4 text-black bg-white ">
              
                <div className="flex-1 overflow-x-auto mt-2">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Nome do projeto</th>
                                <th className="border p-2 text-left">Gerente do Projeto</th>
                                <th className="border p-2 text-left">Situação</th>
                                <th className="border p-2 text-left">Unidade</th>
                                <th className="border p-2 text-left">Número do processo SEI</th>
                                <th className="border p-2 text-left">Área Demandante</th>
                                <th className="border p-2 text-left">Ano</th>
                                <th className="border p-2 text-left">Ação</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.ID} className="shadow">   
                                <td className="border p-2">{item.NM_PROJETO}</td>
                                <td className="border p-2">{item.GERENTE_PROJETO}</td>
                                <td className="border p-2">{item.SITUACAO}</td>
                                <td className="border p-2">{item.UNIDADE}</td>
                                <td className="border p-2">{item.NR_PROCESSO_SEI}</td>
                                <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                                <td className="border p-2">{item.ANO}</td>
                        
                        
                        
                        
                        
                        
                       

                                </tr>
                            ))}
                           
                
                        </tbody>
                    </table>
                 
                    <div className="pagination mx-auto mt-5" style={{textAlign: "center"}}>
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
  
            </>   
    )
}

