"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import 'material-icons/iconfont/material-icons.css';

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("user_info");
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
          className="flex items-center py-3 px-4 w-full bg-blue-700 text-white hover:text-white cursor-pointer"
          onClick={() => router.push("/newindex")}
        >
          <span className="material-icons mr-3">pie_chart</span>
          <span className="link-text">Dashboard</span>
        </button>

        {/* Dropdown */}
        <div>
          <button
            onClick={toggleDropdown}
            className="flex items-center w-full py-3 px-4 text-blue-300 hover:bg-blue-800 focus:outline-none hover:text-white"
          >
            <span className="material-icons mr-3">folder</span>
            <span className="link-text flex-1 text-left">Área de trabalho</span>
            <span className="material-icons">{dropdownOpen ? "expand_less" : "expand_more"}</span>
          </button>

          {dropdownOpen && (
            <div className="flex flex-col ml-10 mt-1 space-y-1">
              {[
                { icon: "apps", text: "Demandas", href: "/newindex2" },
                { icon: "interests", text: "Tipos", href: "/newindex2" },
                { icon: "group", text: "Demandantes", href: "/newindex2" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => router.push(item.href)}
                  className="flex items-center py-3 px-4 text-blue-300 hover:bg-blue-800 hover:text-white"
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span className="link-text">{item.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Rodapé */}
      <div className="mt-auto p-4 border-t border-blue-700">
        <div className="mb-2">
          <p className="text-sm">Bem-vindo</p>
          <p className="text-sm font-bold">Antonio</p>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => router.push("/newindex3")}
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
