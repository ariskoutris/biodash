import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



const HorizontalBarPlot = ({data}) => {

    const labels = Object.keys(data.importances);
    const importances = Object.values(data.importances);
    const options = {
        indexAxis: 'y',
        elements: {
        bar: {
            borderWidth: 2,
        },
        },
        responsive: true,
        plugins: {
        legend: {
            // position: 'right',
            display: false,
        }
        },
    };
    const bar_data = {
      labels,
      datasets: [
        {
          // label: 'Dataset 1',
          data: importances,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    return <Bar options={options} data={bar_data} />;
    
}
  
export default HorizontalBarPlot;