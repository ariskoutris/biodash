import React from 'react';
import './ForecastPlot.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const ForecastPlot = ({data}) => {
     const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            display: false,
          }
        },
      };

      const labels = data.time_series.map(item => item.time);
      const values = data.time_series.map(item => item.value);

       const line_data = {
        labels,
        datasets: [
          {
            // label: 'Dataset 1',
            data: values,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
   return <Line options={options} data={line_data} />;
}
  
export default ForecastPlot;