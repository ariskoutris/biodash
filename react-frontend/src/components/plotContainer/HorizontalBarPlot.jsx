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

var _ = require("lodash");

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getSortedData = (labels, vals) => {
  const combinedData = _.zip(labels, vals);
  const sortedData = _.sortBy(combinedData, (d) => -Math.abs(d[1]));
  const sortedLabels = sortedData.map((d) => d[0]);
  const sortedVals = sortedData.map((d) => d[1]);

  return [sortedLabels, sortedVals];
}

const HorizontalBarPlot = ({ data, period }) => {
  // Use 4.2 as an approximation for the number of weeks in a month
  const numWeeks = Math.ceil(4.2 * period);
  
  const labels = Object.keys(data);
  const importances = labels.map(label => data[label][numWeeks]);

  const cleanedLabels = labels.map(cleanLabel);
  const [sortedLabels, sortedImportances] = getSortedData(cleanedLabels, importances);

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
    labels: sortedLabels,
    datasets: [
      {
        // label: 'Dataset 1',
        data: sortedImportances,
        borderColor: colors.currentPlotColor,
        backgroundColor: colors.currentPlotColorLight,
      },
    ],
  };
  return <Bar options={options} data={bar_data} />;
};

export default HorizontalBarPlot;
