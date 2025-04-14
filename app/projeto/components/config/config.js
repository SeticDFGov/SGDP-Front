export const optionsGraph = {
    indexAxis: 'y', 
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