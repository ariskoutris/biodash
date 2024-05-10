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
    console.log(data)
  }, [data]);

  const onTimePeriodSelected = (e) => {
    const period = e.target.value;
    console.log(period);
    setPeriod(period);
    // here filter data based on period
    setReadyData(data);
  };

  const onTargetSelected = (e) => {
    const target = e.target.value;
    console.log(target);
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
