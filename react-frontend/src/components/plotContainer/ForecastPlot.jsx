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
import colors from '../../colors.module.scss';

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
            borderColor: colors.currentPlotColor,
            backgroundColor: colors.currentPlotColorLight,
          },
        ],
      };
   return <Line options={options} data={line_data} />;
}
  
export default ForecastPlot;