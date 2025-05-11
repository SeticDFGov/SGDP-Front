export const optionsGraph = {
    layout: {
        padding: {
          right: 50 // mais espaço pros rótulos
        }
    },
    indexAxis: 'y',
    maintainAspectRatio: true,
    plugins: {
        legend: { display: false },
        datalabels: {
            anchor: 'end',
            align: 'end',
            color: '#000',
            font: {
                weight: 'bold'
            },
            formatter: Math.round 
        }
    },
    scales: {
        x: {
            display: false 
        },
        y: {
            ticks: {
                font: {
                    size: 14
                }
            }
        }
    }
};