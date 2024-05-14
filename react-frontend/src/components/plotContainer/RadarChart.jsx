import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import colors from "../../colors.module.scss";
import { getRadarLabels } from "../../utils";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  const labels = getRadarLabels(data);
  const currentValues = Object.values(data.current);
  const predictedValues = Object.values(data.predicted);
  const radarData = {
    labels,
    datasets: [
      {
        label: "Current",
        data: currentValues,
        backgroundColor: colors.currentPlotColorLight,
        borderColor: colors.currentPlotColor,
        borderWidth: 1,
      },
      {
        label: "Predicted",
        data: predictedValues,
        backgroundColor: colors.predictedPlotColorLight,
        borderColor: colors.predictedPlotColor,
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
      },
    },
  };
  return <Radar data={radarData} options={options} />;
};

export default RadarChart;
