import { useEffect, useState } from "react";
import { PlotContainer } from "../../components/plotContainer/plotContainer";
import RadarChart from "../../components/plotContainer/RadarChart";
import ForecastPlot from "../../components/plotContainer/ForecastPlot";
import HorizontalBarPlot from "../../components/plotContainer/HorizontalBarPlot";
import { InteractionsContainer } from "../../components/InteractionsContainer";

export const MainPage = ({ data }) => {
  const [readyData, setReadyData] = useState();
  const [period, setPeriod] = useState(3); // in months
  const [target, setTarget] = useState("weight");

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

  // this is a demo hook for the plot
  const RadarPlotHook = (target) => {
    // set the buttons names to generate
    // setRecommendationButtonState into an array of the same size as the names so we don't overflow
    // set the showRecommendationButtons to true to display them
    // keep what was pressed
  };

  const getCurrentProjectedTarget = (data) => {
    const lineTS = data.line.time_series;
    return Math.round(lineTS[lineTS.length - 1]["value"]);
  }

  const getTargetMinMax = (target, data) => {
    const currentValue = data.radar.current || 0;
  
    if (target === "weight") {
      return { min: currentValue.Weight - 30, max: currentValue.Weight };
    }

    if (target === "metabolic_age") {
      return { min: currentValue - 8, max: currentValue + 2};
    }

    if (target === "muscle_mass_perc") {
      return { min: currentValue * 0.6, max: currentValue * 1.1 };
    }

    if (target === "fat_mass_perc") {
      return { min: target * 0.7, max: target * 1.3 };
    }

    if (target === "heart_rate_at_rest") {    
      return { min: target - 20, max: target + 5 };
    }
  }

  // if data not ready yet return empty
  if (!readyData) return <> </>;

  const forecastPlot = <ForecastPlot data={data.line} />;
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
          currentProjectedTarget={getCurrentProjectedTarget(data)}
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
              title="Forecast"
              content={forecastPlot}
              height={size}
              width={size}
            />
            <PlotContainer
              key="BarPlot"
              title="Feature importance"
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
