import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import colors from "../../colors.module.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HorizontalBarPlot = ({ data, period }) => {
  const labels = Object.keys(data);
  const numWeeks = Math.floor((period * 52) / 12);
  const importances = Object.values(data).map((value) => value[numWeeks]);
  const options = {
    indexAxis: "y",
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
      },
    },
  };
  const bar_data = {
    labels,
    datasets: [
      {
        // label: 'Dataset 1',
        data: importances,
        borderColor: colors.currentPlotColor,
        backgroundColor: colors.currentPlotColorLight,
      },
    ],
  };
  return <Bar options={options} data={bar_data} />;
};

export default HorizontalBarPlot;
