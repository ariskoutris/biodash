import { useEffect, useState } from "react";
import { PlotContainer } from "../../components/plotContainer/plotContainer";
import RadarChart from "../../components/plotContainer/RadarChart";
import ForecastPlot from "../../components/plotContainer/ForecastPlot";
import HorizontalBarPlot from "../../components/plotContainer/HorizontalBarPlot";
import { InteractionsContainer } from "../../components/InteractionsContainer";
import {
  getLabelFromTarget,
  getUnitsFromTarget,
  getProjectedTarget,
  getTargetMin,
  getTargetMax,
} from "../../utils";

export const MainPage = ({
  data,
  recData,
  period,
  setPeriod,
  target,
  setTarget,
  getRecommendations,
  handleRecommendationClick,
}) => {
  const [readyData, setReadyData] = useState();
  const [targetSeed, setTargetSeed] = useState(false);

  useEffect(() => {
    setReadyData(data);
  }, [data]);

  const onTimePeriodSelected = (e, seed) => {
    const newPeriod = e.target.value;
    setTargetSeed(seed);
    setPeriod(newPeriod);
  };

  const onTargetSelected = (e) => {
    const target = e.target.value;
    setTargetSeed(false);
    setTarget(target);
  };

  // if data not ready yet return empty
  if (!readyData) return <></>;
  const forecastPlot = (
    <ForecastPlot
      data={data.line}
      min={getTargetMin(target, data)}
      max={getTargetMax(target, data)}
      units={getUnitsFromTarget(target)}
      metric={target}
      period={period}
    />
  );
  const radarChart = <RadarChart data={data.radar} />;
  const barPlot = <HorizontalBarPlot data={data.bar} period={period} />;

  const size = "90%";

  // otherwise build body
  return (
    <div className="boxBody">
      <div className="boxBodyColumn">
        <InteractionsContainer
          data={readyData}
          recData={recData}
          target={target}
          period={period}
          minTargetValue={getTargetMin(target, data)}
          maxTargetValue={getTargetMax(target, data)}
          projectedTarget={getProjectedTarget(target, data)}
          initialTargetValue={targetSeed || getProjectedTarget(target, data)}
          timePeriodSelectHandler={onTimePeriodSelected}
          targetSelectHandler={onTargetSelected}
          getRecommendations={getRecommendations}
          handleRecommendationClick={handleRecommendationClick}
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
              title={`Forecast for ${getLabelFromTarget(target)}`}
              content={forecastPlot}
              height={size}
              width={size}
            />
            <PlotContainer
              key="BarPlot"
              title={`Feature importance for ${getLabelFromTarget(target)}`}
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
