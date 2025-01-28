"use client";

import React, { useEffect, useState } from "react";


// URL da API e headers
const API_URL = "https://graph.microsoft.com/v1.0/sites/685aff9c-79e6-43fb-b9dd-affa07528c81/lists/82008320-2414-4740-a1eb-04e68d021fa2/items?$expand=fields";

const TOKEN = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjVNcVVTZXhoWU0wdC1LMTQ0NUxsbmFVbFk5aFFOVEhBWXF6NERlY2NSSnMiLCJhbGciOiJSUzI1NiIsIng1dCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyIsImtpZCI6IllUY2VPNUlKeXlxUjZqekRTNWlBYnBlNDJKdyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lNWYyMTBjZC0yMTViLTQxYTgtOWNmZC02NGM2MWJkOTg2ZGIvIiwiaWF0IjoxNzM4MDIzNzkwLCJuYmYiOjE3MzgwMjM3OTAsImV4cCI6MTczODExMDQ5MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhaQUFBQTY2TUpWVlhWZ2lXRGFBZDlZYTduZ09DUitPUW1TTVM5WGp0REZTaGNHdmdpMXF6ZExjRk94alpaSU9TbXozNjVyc2N1b1JmYnlpMEdqckV6NVZmRlhOMG44T3pWTTZPaWx4T0dpcGJwbjZFPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoic291c2EiLCJnaXZlbl9uYW1lIjoiTWFyY2lvIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiNDUuMjI0LjE5OS4xMDEiLCJuYW1lIjoiTWFyY2lvIHNvdXNhIiwib2lkIjoiYzRjOTIzZWItYTQwOS00NjA1LWEzMTMtOTE4MmJlNmZiN2JlIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAzNjYxRjVBNkUiLCJyaCI6IjEuQWNvQXpSRHk1VnNocUVHY19XVEdHOW1HMndNQUFBQUFBQUFBd0FBQUFBQUFBQUQ2QUtMS0FBLiIsInNjcCI6Im9wZW5pZCBwcm9maWxlIFNpdGVzLlJlYWQuQWxsIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5SZWFkIGVtYWlsIiwic2lkIjoiMDAxMzQxYzktNGQwNC1iYzZlLTgyYzctYThmMmFiYmIwYmVlIiwic3ViIjoidWVNdmpDMzU0WjZiOThBRm5IU1dmQWdLTGpBcWdBaHhVVlBYYkNqUk5EcyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6ImU1ZjIxMGNkLTIxNWItNDFhOC05Y2ZkLTY0YzYxYmQ5ODZkYiIsInVuaXF1ZV9uYW1lIjoiYWRtQGlub2xvZ3kuY29tLmJyIiwidXBuIjoiYWRtQGlub2xvZ3kuY29tLmJyIiwidXRpIjoiVjRQUzlvTGhZVWFXWnBZOG5zd01BQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMWE3ZDc4YjYtNDI5Zi00NzZiLWI4ZWItMzVmYjcxNWZmZmQ0IiwiZjI4YTFmNTAtZjZlNy00NTcxLTgxOGItNmExMmYyYWY2YjZjIiwiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX2Z0ZCI6IkpaUTJma2g0Nmc3bDNxcjY4eFcxNDZiR2xiQXF1dGJFRmt1WDBFWXFkbFUiLCJ4bXNfaWRyZWwiOiIyNiAxIiwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoiM0VNU2pXVkxhTXBkT1d2aEs1SVgyQ1JYV09iaUg0RkdUb3Z0V1ZNcGotSSJ9LCJ4bXNfdGNkdCI6MTcxMTA1MzY5NX0.FPf6oyb85MJcXt9hAsiyCC-j9p738OPKpSBtg4SktyPjtUQs5GM9F6vxA_fikwCh_B69-8up1JDJSW9QNf75Z7fqUaXhIM3nukoZqS881yivWDG8cGHbpdViVFrl5bNJQw_j3PwjfuVgykpXrmFFjFqHEYW9PiHZQZKnssoTyVGnHuwxXge8cX4ZRz69mpjGjPt52pXsoSrrrHUCjonc8jQWVUgAZqOwNlC14YKn7XlMGuKZazagCaMC6hxmxca0LJMfyEWeZO-ep2iLZ6v8W6qNEUtt_CMx2-Fm8dMjs97eDyOrZivaRbEa12RDnFPy2un06xGLZ0LrEEvhTX-uaw";

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
        console.log(data.value)
        setItems(data.value || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
     <div className="p-4">
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
                  Status da nomeDemanda
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
                    {item.fields?.nomeDemanda  || "-"}
                  </td>
                  <td className="border border-gray-300 px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    {/* Bolinha colorida */}
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor: item.fields?.["farol"] || "rgb(200, 200, 200)", // cor padrão cinza
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