import './RadarChart.css'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


const RadarChart = ({data, target_hook}) => {
  const labels = Object.keys(data.current);
  const currentValues = Object.values(data.current);
  const predictedValues = Object.values(data.predicted);
  const radarData = {
    labels,
    datasets: [
      {
        label: 'Current',
        data: currentValues,
        backgroundColor: 'rgba(132, 99, 255, 0.2)',
        borderColor: 'rgba(132, 99, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Predicted',
        data: predictedValues,
        backgroundColor: 'rgba(255, 204, 0, 0.2)',
        borderColor: 'rgba(255, 204, 0, 1)',
        borderWidth: 1,
      },
    ],
  };
  return <Radar data={radarData}/>
}
  
export default RadarChart;