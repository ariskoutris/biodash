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
var _ = require("lodash");

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ data }) => {
  if (!data) return <></>;

  const labels = getRadarLabels(data);
  const radarData = {
    labels,
    datasets: _.map(data, (values, key) => {
      return {
        label: _.capitalize(key),
        data: Object.values(values),
        backgroundColor: colors[key + "PlotColorLight"],
        borderColor: colors[key + "PlotColor"],
        borderWidth: 1,
      };
    }),
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
