"use client";

import React, { useEffect, useState } from "react";
import { getMicrosoftGraphToken } from "./services/tokenService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// URL da API do Microsoft Graph
const API_URL =
  "https://graph.microsoft.com/v1.0/sites/685aff9c-79e6-43fb-b9dd-affa07528c81/lists/82008320-2414-4740-a1eb-04e68d021fa2/items?$expand=fields";

const App = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para contagem de demandas por status
  const [concluidas, setConcluidas] = useState(0);
  const [emAndamento, setEmAndamento] = useState(0);
  const [atrasadas, setAtrasadas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const TOKEN = await getMicrosoftGraphToken();
        if (!TOKEN) throw new Error("Token não encontrado!");

        const headers = {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        };

        const response = await fetch(API_URL, { headers });
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }

        const data = await response.json();
        setItems(data.value || []);

        // Contagem dos registros por status
        const concluidasCount = data.value.filter(item => item.fields?.statusDemanda === "Concluído").length;
        const andamentoCount = data.value.filter(item => item.fields?.statusDemanda === "Em andamento").length;
        const atrasadasCount = data.value.filter(item => item.fields?.statusDemanda === "Atrasado").length;

        setConcluidas(concluidasCount);
        setEmAndamento(andamentoCount);
        setAtrasadas(atrasadasCount);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Configuração dos gráficos Doughnut
  const createChartData = (value, color) => ({
    labels: ["Total"],
    datasets: [
      {
        data: value,
        backgroundColor: color,
        borderWidth: 8, // Deixa a borda do velocímetro mais grossa
      },
    ],
  });

  const options = {
    circumference: 360,
    rotation: -90,
    cutout: "70%", // Ajusta a espessura do gráfico
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="p-4 bg-white h-screen">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3">
        <h1 className="text-3xl font-semibold">SUBTDCR</h1>
      </header>

      {/* Gráficos de velocidade */}
      <div className="flex justify-center mt-6">
        
        <div className="w-1/3 p-4 flex flex-col items-center">
          <h2 className="text-center font-semibold mb-2 text-black">Percentual de execução das demandas</h2>
          <div className="h-48">
            <Doughnut data={createChartData([concluidas, emAndamento, atrasadas], ["green","yellow","red"])} options={options} />
          </div>
          
        </div>
       
      </div>

      {/* Corpo principal - Tabela */}
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
                      <div
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor: item.fields?.farol || "rgb(200, 200, 200)",
                        }}
                      ></div>
                      <span>{item.fields?.statusDemanda || "-"}</span>
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
