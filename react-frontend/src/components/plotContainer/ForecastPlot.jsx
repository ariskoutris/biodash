import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import colors from "../../colors.module.scss";
import { getLineChartKeys } from "../../utils";
var _ = require("lodash");

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForecastPlot = ({ data, min, max, units, metric, period }) => {
  // Use 4.2 as an approximation for the number of weeks in a month
  const numWeeks = Math.ceil(4.2 * period) - 1;
  const lineData = _.mapValues(data, (val) =>
    _.filter(
      val[getLineChartKeys(metric)] || [],
      (item) => item.time <= numWeeks
    )
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        min: min,
        max: max,
        title: {
          display: true,
          text: units,
        },
      },
      x: {
        title: {
          display: true,
          text: "Time (weeks)",
        },
      },
    },
  };
  const labels = lineData?.predicted.map((item) => item.time);

  const line_data = {
    labels,
    datasets: _.map(lineData, (val, key) => {
      return {
        label: key,
        data: val.map((item) => item.value),
        borderColor: colors[key + "PlotColor"],
        backgroundColor: colors[key + "PlotColorLight"],
      };
    }),
  };
  return <Line options={options} data={line_data} />;
};

export default ForecastPlot;
