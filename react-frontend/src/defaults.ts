import { RadarData } from "./types/charts";

const defaultRadarData : RadarData = {
  "Weight": 0,
  "Muscle Mass": 0,
  "Metabolic Age": 0,
  "Fat mass Perc": 0,
  "HR At Rest": 0,
};

const defaultRadar = {
  current: defaultRadarData,
  predicted: defaultRadarData,
};

const defaultLineData = {
  "Weight": [],
  "Muscle Mass": [],
  "Metabolic Age": [],
  "Fat mass Perc": [],
  "HR At Rest": [],
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