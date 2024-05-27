import { LineData, RadarData } from "./charts";

export interface Recommendation {
  title: string,
  new_metrics: RadarData,
  new_ts: LineData,
}

export type Recommendations = Recommendation[];