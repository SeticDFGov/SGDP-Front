"use client";

import 'material-icons/iconfont/material-icons.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './demandas/components/Header';

export default function HomePage() {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      const user = localStorage.getItem("user_info");

      setIsAuthenticated(authStatus === "true");
      setUserInfo(JSON.parse(user));

      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const modules = [
    {
      icon: 'analytics',
      title: 'SGD',
      h2: 'Sistema de Gestão de Demandas',
      color: 'text-white',
      path: '/demandas',
      disabled: userInfo?.SUBINFRA, // desativa se SUBINFRA === true
    },
    {
      icon: 'assignment',
      title: 'SGP',
      h2: 'Sistema de Gestão de Projetos',
      color: 'text-white',
      path: '/projeto',
      disabled: false,
    },
    {
      icon: 'settings',
      title: 'SEGD',
      h2: 'Estratégia de Governança Digital',
      color: 'text-white',
      path: '/segd',
      disabled: true, // sempre desativado como no original
    },
    {
      icon: 'settings',
      title: 'SIMI',
      h2: 'Sistema de Monitoramento de Indicadores',
      color: 'text-white',
      path: '/simi',
      disabled: true, // sempre desativado como no original
    },
  ];

  return (
    <>
    <div className='bg-gray-100 text-white min-h-screen flex items-center justify-center px-4'>

    
      <div className="max-w-5xl w-full">
        <h1 class="text-3xl font-bold mb-8 text-center text-black">Selecione um Módulo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {modules.map((mod, index) => (
            <div
              key={index}
              className={`bg-blue-800 cursor-pointer rounded-2xl p-6 shadow-lg hover:bg-blue-700 transition-colors flex flex-col items-center text-center"
                ${mod.disabled ? 'pointer-events-none opacity-50' : ''}`}
              onClick={() => !mod.disabled && router.push(mod.path)}
            >
              <span className={`material-icons ${mod.color} text-6xl mb-2`}>
                {mod.icon}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-white">{mod.title}</h2>
              <p class="text-sm text-blue-200 mt-2">{mod.h2}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}

