import { useState, useEffect, useRef } from "react";

import Chart from "chart.js/auto";
import { getAllItems } from "../services/apiService";

const Dashboard = () => {
  const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const demandanteChartRef = useRef(null);
    const lineChartRef = useRef(null);

    const destroyChart = (chartRef) => {
    if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
    }
    };

    const fetchItems = async () => {
    setIsLoading(true);
    try {
        const data = await getAllItems();
        console.log("Dados recebidos:", data);

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
  if (items.length > 0) {
    updateCharts(items);
  }
}, [items]);

const updateCharts = (data) => {
  const categorias = {};
  const status = {Em_andamento:0, Atrasados:0, Realizadas: 0, Nao_iniciada:0}
  const demandante = {}
  const nm_demandante =[]
  data.forEach((item) => {
    if (!categorias[item.CATEGORIA]) {
      categorias[item.CATEGORIA] = { soma: 0, count: 0 };
    }
    categorias[item.CATEGORIA].soma += 1;
    categorias[item.CATEGORIA].count += 1;

    if(item.STATUS == "Em andamento"){
       status["Em_andamento"] += 1; 
    }
    if(item.STATUS == "Não iniciada"){
       status["Nao_iniciada"] += 1; 
    }
    if(item.STATUS == "Atrasados"){
       status["Atrasados"] += 1; 
    }
    if(item.STATUS == "Realizadas"){
       status["Realizadas"] += 1; 
    }
    if(item.NM_PO_DEMANDANTE)
  });

  const labels = Object.keys(categorias);
  const valoresMedios = labels.map((cat) => categorias[cat].soma / categorias[cat].count);

  destroyChart(barChartRef);
  barChartRef.current.chartInstance = new Chart(barChartRef.current, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Média por Categoria",
          data: valoresMedios,
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        },
      ],
    },
  });

  destroyChart(doughnutChartRef);
  doughnutChartRef.current.chartInstance = new Chart(doughnutChartRef.current, {
    type: "doughnut",
    data: {
      labels: ["Realizadas", "Em andamento", "Atrasadas", "Não iniciada"],
      datasets: [
        {
          data: [status["Realizadas"], status["Em_andamento"], status["Atrasados"], status["Nao_iniciada"]],
          backgroundColor: ["#17eba0", "#ffbc44", "#fc6161", "#1c2c34"],
        },
      ],
    },
  });

  destroyChart(demandanteChartRef);
  demandanteChartRef.current.chartInstance = new Chart(demandanteChartRef.current, {
    type: "bar",
    data: {
      labels: ["Ney Ferraz", "Wisney", "Ibaneis", "Vitor Crispim"],
      datasets: [
        {
          data: [12, 19, 3, 5],
          backgroundColor: "#1c2c34",
        },
      ],
    },
  });

  destroyChart(lineChartRef);
  lineChartRef.current.chartInstance = new Chart(lineChartRef.current, {
    type: "line",
    data: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [
        {
          data: [10, 15, 8, 12],
          borderColor: "#fc6161",
          fill: true,
        },
      ],
    },
  });
};

return (
  <div className="bg-white p-4">
    <h1 className="text-2xl font-bold">Dashboard de Demandas</h1>
    {isLoading ? (
      <p>Carregando...</p>
    ) : (
      <>
        <canvas ref={barChartRef} />
        <canvas ref={doughnutChartRef} />
        <canvas ref={demandanteChartRef} />
        <canvas ref={lineChartRef} />
      </>
    )}
  </div>
);

};

export default Dashboard;
