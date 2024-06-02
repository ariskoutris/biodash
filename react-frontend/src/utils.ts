import { Recommendations } from "./types/recommendations";

var _ = require("lodash");

const label_to_units = {
  Weight: "kg",
  body_fat_perc: "%",
  "Muscle Mass": "%",
  metabolic_age: "years",
  "Fat mass Perc": "%",
  heart_rate_at_rest: "bpm",
};

const label_to_target = {
  'Weight': "Weight",
  "Body Fat Perc": "body_fat_perc",
  "Muscle Mass": "Muscle Mass",
  "Metabolic Age": "metabolic_age",
  "Fat mass Perc": "Fat Mass Perc",
  "Resting Heart Rate": "heart_rate_at_rest",
};

const target_to_string = {
  Weight: "Weight",
  body_fat_perc: "Body Fat Percentage",
  "Muscle Mass": "Muscle Mass",
  metabolic_age: "Metabolic Age",
  "Fat mass Perc": "Fat Mass Percentage",
  heart_rate_at_rest: "Heart Rate at Rest",
};

const target_to_radar_keys: { [key: string]: string } = {
  Weight: "Weight",
  body_fat_perc: "Body Fat Percentage",
  "Muscle Mass": "Muscle Mass",
  metabolic_age: "Metabolic Age",
  "Fat mass Perc": "Fat mass Perc",
  heart_rate_at_rest: "Heart Rate at Rest",
};

const target_to_line_keys: { [key: string]: string } = {
  Weight: "Weight",
  body_fat_perc: "Body Fat Percentage",
  "Muscle Mass": "Muscle Mass",
  metabolic_age: "Metabolic Age",
  "Fat mass Perc": "Fat mass Perc",
  heart_rate_at_rest: "Heart Rate at Rest",
};

export const transformRecData = (data: any): Recommendations => {
  return _.map(data.recommendations, (rec: any) => ({
    title: rec.recommendation,
    new_metrics: rec.new_metrics,
    new_ts: {
      [data.metric]: rec.new_ts,
    },
  }));
};

export const getTargetFromLabel = (label: string) => {
  return label_to_target[label as keyof typeof label_to_target];
}

export const getLineChartKeys = (target: string) => {
  return target_to_line_keys[target];
};

export const getTargetUnits = (target: any) => {
  return label_to_units[target as keyof typeof label_to_units];
};

export const getTargetLabel = (target: any) => {
  return target_to_string[target as keyof typeof target_to_string];
};

export const getRadarLabels = (data: any) => {
  const labels = Object.keys(data.current);
  const labelsWithUnits = labels.map((label) => {
    if (label === "Muscle Mass") return "Muscle Mass Perc (%)";
    return `${label} (${getTargetUnits(
      label_to_target[label as keyof typeof label_to_target]
    )})`;
  });
  return labelsWithUnits;
};

export const getProjectedTarget = (target: any, data: any) => {
  const predictedValue =
    data?.radar?.predicted?.[target_to_radar_keys[target]] || null;
  return Math.round(predictedValue || 0);
};

export const getTargetMinMax = (target: any, data: any) => {
  const currentValue =
    data?.radar?.current?.[target_to_radar_keys[target]] || null;

  if (target === "Weight") {
    return {
      min: currentValue ? currentValue - 15 : 0,
      max: currentValue ? currentValue + 15 : 0,
    };
  }

  if (target === "metabolic_age") {
    return {
      min: currentValue ? currentValue - 8 : 0,
      max: currentValue ? currentValue + 2 : 0,
    };
  }

  if (target === "Muscle Mass") {
    return {
      min: currentValue ? currentValue * 0.6 : 0,
      max: currentValue ? currentValue * 1.1 : 0,
    };
  }

  if (target === "Fat mass Perc" || target === "body_fat_perc") {
    return {
      min: currentValue ? currentValue * 0.7 : 0,
      max: currentValue ? currentValue * 1.3 : 0,
    };
  }

  if (target === "heart_rate_at_rest") {
    return {
      min: currentValue ? currentValue - 20 : 0,
      max: currentValue ? currentValue + 5 : 0,
    };
  }
};
