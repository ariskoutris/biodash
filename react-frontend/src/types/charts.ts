export interface RadarData {
  "Weight"?: number;
  "Body Fat Perc"?: number;
  "Muscle Mass"?: number;
  "Metabolic Age"?: number;
  "Fat mass Perc"?: number;
  "Resting Heart Rate"?: number;
}

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
  "Body Fat Perc"?: TSPoint [],
  "Muscle Mass"?: TSPoint[],
  "Metabolic Age"?: TSPoint [],
  "Fat mass Perc"?: TSPoint [],
  "Resting Heart Rate"?: TSPoint[],
}

export interface Line {
  predicted: LineData;
  recommended?: LineData;
}

export interface Bar {
  [key: string]: number[];
}

export interface ChartData {
  radar: Radar;
  line: Line;
  bar: Bar;
}