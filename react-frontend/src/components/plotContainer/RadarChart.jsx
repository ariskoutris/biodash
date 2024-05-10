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
import colors from '../../colors.module.scss';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


const RadarChart = ({data, target_hook}) => {
  console.log(colors)
  const labels = Object.keys(data.current);
  const currentValues = Object.values(data.current);
  const predictedValues = Object.values(data.predicted);
  const radarData = {
    labels,
    datasets: [
      {
        label: 'Current',
        data: currentValues,
        backgroundColor: colors.currentPlotColorLight,
        borderColor: colors.currentPlotColor,
        borderWidth: 1,
      },
      {
        label: 'Predicted',
        data: predictedValues,
        backgroundColor: colors.predictedPlotColorLight,
        borderColor: colors.predictedPlotColor,
        borderWidth: 1,
      },
    ],
  };
  return <Radar data={radarData}/>
}
  
export default RadarChart;