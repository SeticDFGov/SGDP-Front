"use client";

import React, { useEffect, useState } from "react";
import { token } from "./services/tokenService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// URL da API e headers
const API_URL =
  "https://graph.microsoft.com/v1.0/sites/685aff9c-79e6-43fb-b9dd-affa07528c81/lists/82008320-2414-4740-a1eb-04e68d021fa2/items?$expand=fields";

const TOKEN = token;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/json",
};

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os dados
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
          console.log(response);
          throw new Error("Erro ao buscar os dados");
        }
        const data = await response.json();
        
        console.log(data.value);

        const total = data.value.length
        setItems(data.value || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for the speedometer graphs
  const speedometerData = {
    labels: ["Total"],
    datasets: [
      {
        data: [total], // Example values (you can replace these with dynamic data)
        backgroundColor: ["black"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    circumference: 180, // Half-circle
    rotation: -90, // Rotate to start from the left
    cutout: "90%", // Make it a thin ring
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="p-4 bg-white h-screen">
      {/* Cabeçalho estilizado */}
      <header className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3">
        {/* SVG do ícone de árvore */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2v16m-7 4h14"
          />
        </svg>
        <h1 className="text-3xl font-semibold">SUBTDCR</h1>
      </header>

      {/* Speedometer Graphs */}
      <div className="flex justify-between mt-6">
        <div className="w-1/3 p-4">
          <h2 className="text-center font-semibold mb-2">Demandas Concluídas</h2>
          <Doughnut data={speedometerData} options={options} />
        </div>
        <div className="w-1/3 p-4">
          <h2 className="text-center font-semibold mb-2">Demandas em Progresso</h2>
          <Doughnut data={speedometerData} options={options} />
        </div>
        <div className="w-1/3 p-4">
          <h2 className="text-center font-semibold mb-2">Demandas Pendentes</h2>
          <Doughnut data={speedometerData} options={options} />
        </div>
      </div>

      {/* Corpo principal */}
      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : error ? (
          <p className="text-red-500">Erro: {error}</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-200 mt-4 shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nome da Demanda
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status da Demanda
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status da Demanda
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
                    {item.fields?.nomeDemanda || "-"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      {/* Bolinha colorida */}
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            item.fields?.["farol"] || "rgb(200, 200, 200)", // cor padrão cinza
                        }}
                      ></div>
                      {/* Texto ao lado da bolinha */}
                      <span>{item.fields?.["statusDemanda"] || "-"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;