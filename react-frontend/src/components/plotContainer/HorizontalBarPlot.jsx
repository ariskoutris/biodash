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
import { cleanLabel } from "../../utils";

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
  const cleanedLabels = labels.map(cleanLabel);

  // Use 4.2 as an approximation for the number of weeks in a month
  const numWeeks = Math.ceil(4.2 * period);
  const importances = labels.map(label => data[label][numWeeks]);
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
    labels: cleanedLabels,
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
