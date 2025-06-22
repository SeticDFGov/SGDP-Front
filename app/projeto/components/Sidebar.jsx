"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';
import { useAuth } from "@/app/contexts/AuthContext";

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth(); 
 

 if (loading) {
    
    return <div>Carregando...</div>;
  }

  if (!user) {
    
    return <div>Você precisa estar logado.</div>;
  }
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    router.push("/auth");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50">
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <img src="/ipe.png" alt="Projetist Logo" className="h-10" />
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto">
  {/* Dashboard */}
  <button
    className="flex items-center py-3 px-4 w-full text-blue-300 bg-blue-900 hover:bg-blue-800  hover:text-white cursor-pointer mb-2"
    onClick={() => router.push("/projeto/dashboard")}
  >
    <span className="material-icons mr-3 ">pie_chart</span>
    <span className="link-text ">Dashboard</span>
  </button>

  <button
    className="flex items-center py-3 px-4 w-full bg-blue-900 text-blue-300 hover:bg-blue-800 hover:text-white cursor-pointer"
    onClick={() => router.push("/projeto")}
  >
    <span className="material-icons mr-3  ">view_kanban</span>
    <span className="link-text  ">Projetos</span>
  </button>
</nav>


      {/* Rodapé */}
      <div className="mt-auto p-4 border-t border-blue-700">
        <div className="mb-2">
          <p className="text-sm">Bem-vindo</p>
          <p className="text-sm font-bold">{user.nome}</p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center py-2 px-3 text-blue-300 hover:bg-blue-800 hover:text-white rounded"
          >
            <span className="material-icons mr-2">swap_horiz</span>
            <span>Módulos</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center py-2 px-3 text-white hover:bg-red-600 hover:text-white rounded"
          >
            <span className="material-icons mr-2">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
