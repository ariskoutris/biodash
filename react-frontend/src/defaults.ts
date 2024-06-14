import { RadarData } from "./types/charts";

const defaultRadarData : RadarData = {
  "Weight": 0,
  "Body Fat Perc": 0,
  "Muscle Mass": 0,
  "Metabolic Age": 0,
  "Fat mass Perc": 0,
  "Resting Heart Rate": 0,
};

const defaultRadar = {
  current: defaultRadarData,
  predicted: defaultRadarData,
};

const defaultLineData = {
  "Weight": [],
  "Body Fat Perc": [],
  "Muscle Mass": [],
  "Metabolic Age": [],
  "Fat mass Perc": [],
  "Resting Heart Rate": [],
};

const defaultLine = {
  predicted: defaultLineData,
};

const defaultBar = {
};

const defaultChartData = {
  radar: defaultRadar,
  line: defaultLine,
  bar: defaultBar,
};

export { defaultChartData, defaultRadar, defaultLine, defaultBar };