import { useEffect, useState } from "react";
import { PlotContainer } from "../../components/plotContainer/plotContainer";
import RadarChart from "../../components/plotContainer/RadarChart";
import ForecastPlot from "../../components/plotContainer/ForecastPlot";
import HorizontalBarPlot from "../../components/plotContainer/HorizontalBarPlot";
import { InteractionsContainer } from "../../components/InteractionsContainer";
import {
  getTargetMinMax,
  getTargetLabel,
  getTargetUnits,
  getProjectedTarget,
} from "../../utils";

export const MainPage = ({ data }) => {
  const [readyData, setReadyData] = useState();
  const [period, setPeriod] = useState(3); // in months
  const [target, setTarget] = useState("Weight");

  useEffect(() => {
    setReadyData(data);
  }, [data]);

  const onTimePeriodSelected = (e) => {
    const period = e.target.value;
    setPeriod(period);
    // here filter data based on period
    setReadyData(data);
  };

  const onTargetSelected = (e) => {
    const target = e.target.value;
    setTarget(target);
    // here filter data based on target
    setReadyData(data);
  };

  // if data not ready yet return empty
  if (!readyData) return <></>;

  const forecastPlot = (
    <ForecastPlot
      data={data.line}
      min={getTargetMinMax(target, data).min}
      max={getTargetMinMax(target, data).max}
      units={getTargetUnits(target)}
    />
  );
  const radarChart = <RadarChart data={data.radar} />;
  const barPlot = <HorizontalBarPlot data={data.bar} />;

  const size = "90%";

  // otherwise build body
  return (
    <div className="boxBody">
      <div className="boxBodyColumn">
        <InteractionsContainer
          data={data}
          target={target}
          minTargetValue={getTargetMinMax(target, data).min}
          maxTargetValue={getTargetMinMax(target, data).max}
          projectedTarget={getProjectedTarget(target, data)}
          onTimePeriodSelected={onTimePeriodSelected}
          onTargetSelected={onTargetSelected}
        />
        <div className="boxBodyRow">
          <div className="boxBodyColumn">
            <PlotContainer
              key="RadarPlot"
              title="Bio-Measurements"
              content={radarChart}
              height={size}
              width={size}
            />
          </div>
          <div className="boxBodyColumn">
            <PlotContainer
              key="ForecastPlot"
              title={`Forecast for ${getTargetLabel(target)}`}
              content={forecastPlot}
              height={size}
              width={size}
            />
            <PlotContainer
              key="BarPlot"
              title={`Feature importance for ${getTargetLabel(target)}`}
              content={barPlot}
              height={size}
              width={size}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
