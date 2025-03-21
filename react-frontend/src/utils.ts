import { ChartData, SupportedTarget } from "./types/charts";
import { Recommendations } from "./types/recommendations";

var _ = require("lodash");

const min_adjustments: { [key: string]: number } = {
  "Weight": -7,
  "Metabolic Age": -4,
  "Muscle Mass": 0.85,
  "Fat mass Perc": 0.9,
  "HR At Rest": 0.85,
};

const max_adjustments: { [key: string]: number } = {
  "Weight": 7,
  "Metabolic Age": 4,
  "Muscle Mass": 1.2,
  "Fat mass Perc": 1.1,
  "HR At Rest": 1.2,
};

const target_to_units: { [key: string]: string }  = {
  "Weight": "kg",
  "Muscle Mass": "kg",
  "Metabolic Age": "years",
  "Fat mass Perc": "%",
  "HR At Rest": "bpm",
};

const target_to_keys: { [key: string]: string } = {
  "Weight": "Weight",
  "Muscle Mass": "Muscle Mass",
  "Metabolic Age": "Metabolic Age",
  "Fat mass Perc": "Fat mass Perc",
  "HR At Rest": "HR At Rest",
};

const keys_to_target = _.invert(target_to_keys);

const target_to_string = _.assign({}, target_to_keys, {
  "Fat mass Perc": "Fat Mass Percentage",
});

export const transformRecData = (data: any): Recommendations => {
  return _.map(data.recommendations, (rec: any) => ({
    title: rec.recommendation,
    scale: rec.value,
    new_metrics: rec.new_metrics,
    new_ts: {
      [data.metric]: rec.new_ts,
    },
  }));
};

export const cleanLabel = (label: string) => {
  // Remove 'avg_', '_pastcov', '_statcov' and everything after '_target_'
  let cleaned = label
    .replace("avg_", "")
    .replace("_pastcov", "")
    .replace("_statcov", "")
    .replace(/_target_.*/, "")
    .replace(/_/g, " ");

  cleaned = cleaned.replace(/(\bweek\b)/g, "per $1");

  // Convert to title case
  return cleaned.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const getKeyFromTarget = (target: string) => {
  return target_to_keys[target];
};

export const getUnitsFromTarget = (target: any) => {
  return target_to_units[target as keyof typeof target_to_units];
};

export const getLabelFromTarget = (target: any) => {
  return target_to_string[target as keyof typeof target_to_string];
};

export const getTargetFromKey = (key: any) => {
  return keys_to_target[key as keyof typeof keys_to_target];
}

export const getLabelFromKey = (key: any) => {
  const target = keys_to_target[key as keyof typeof keys_to_target];
  return target_to_string[target as keyof typeof target_to_string];
};

export const getRadarLabels = (data: any) => {
  const labels = Object.keys(data.current);
  const labelsWithUnits = labels.map((label) => {
    return `${label} (${getUnitsFromTarget(
      keys_to_target[label as keyof typeof keys_to_target]
    )})`;
  });
  return labelsWithUnits;
};

export const getProjectedTarget = (target: any, data: any) => {
  const predictedValue =
    data?.radar?.predicted?.[target_to_keys[target]] || null;
  return Math.round(predictedValue || 0);
};

export const getTargetMin = (target: any, data: ChartData) => {
  const key = target_to_keys[target];
  validateTarget(key);
  const minPredVal = _.min(_.map(data.line.predicted[key], "value"));
  const minRecVal = _.min(_.map(data.line.recommended?.[key], "value")) || minPredVal;
  
  const minBound = getAdjustedTarget(target, data, min_adjustments);

  return Math.min(minPredVal, minRecVal, minBound) || 0
};

export const getTargetMax = (target: any, data: ChartData) => {
  const key = target_to_keys[target];
  validateTarget(key);
  const maxPredVal = _.max(_.map(data.line.predicted[key], "value"));
  const maxRecVal = _.max(_.map(data.line.recommended?.[key], "value")) || maxPredVal;
  
  const maxBound = getAdjustedTarget(target, data, max_adjustments);

  return Math.max(maxPredVal, maxRecVal, maxBound) || 0
};

const getAdjustedTarget = (
  target: SupportedTarget,
  data: ChartData,
  adjustments: any
) => {
  const key = target_to_keys[target];
  validateTarget(key);
  const currentValue = data.radar.current[key];

  if (_.includes(["Weight", "Metabolic Age", "HR At Rest"], target)) {
    return currentValue ? currentValue + adjustments[target] : 0;
  } else if (
    _.includes(["Muscle Mass", "Fat mass Perc"], target)
  ) {
    return currentValue ? currentValue * adjustments[target] : 0;
  } else {
    console.error("Invalid target: ", target);
    return 0;
  }
};

function validateTarget(target: any): asserts target is SupportedTarget {
  if (!_.includes(Object.keys(keys_to_target), target)) {
    throw new Error(`Invalid target: ${target}`);
  }
}
