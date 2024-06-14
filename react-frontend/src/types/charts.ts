export interface RadarData {
  "Weight"?: number;
  "Muscle Mass"?: number;
  "Metabolic Age"?: number;
  "Fat mass Perc"?: number;
  "HR At Rest"?: number;
}

export type SupportedTarget = keyof RadarData;

export interface Radar {
  current: RadarData;
  predicted: RadarData;
  recommended?: RadarData;
}

export interface TSPoint {
  time: number,
  value: number
}
export interface LineData {
  "Weight"?: TSPoint[],
  "Muscle Mass"?: TSPoint[],
  "Metabolic Age"?: TSPoint [],
  "Fat mass Perc"?: TSPoint [],
  "HR At Rest"?: TSPoint[],
}

export interface Line {
  predicted: LineData;
  recommended?: LineData;
}

export interface Bar {
  [key: string]: {
    [week: number]: number;
  };
}

export interface ChartData {
  radar: Radar;
  line: Line;
  bar: Bar;
}