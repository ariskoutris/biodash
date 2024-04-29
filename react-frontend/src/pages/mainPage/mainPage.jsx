import "./mainPage.css";
import Form from "react-bootstrap/Form";

import { useEffect, useState } from "react";
import { PlotContainer } from "../../components/plotContainer/plotContainer";
import RadarChart from "../../components/plotContainer/RadarChart";
import ForecastPlot from "../../components/plotContainer/ForecastPlot";
import HorizontalBarPlot from "../../components/plotContainer/HorizontalBarPlot";
import { Recommendataions } from "../../components/Recommendations";

export const MainPage = ({ data }) => {
  const [readyData, setReadyData] = useState();
  const [period, setPeriod] = useState(3); // in months
  const [target, setTarget] = useState("weight");

  useEffect(() => {
    setReadyData(data);
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

  // if data not ready yet return empty
  if (!readyData) return <> </>;

  const forecastPlot = <ForecastPlot data={data.line} />;
  const radarChart = <RadarChart data={data.radar} />;
  const barPlot = <HorizontalBarPlot data={data.bar} />;

  const size = "90%";

  // otherwise build body
  return (
    <div className="boxBody">
      <div style={{ gap: "50px" }} className="boxBodyRow">
        <div className="boxBodyColumn">
          {/*  add row with 2 dropdown menu, one for time period and one for target metric */}
          <div
            style={{
              justifyContent: "center",
              gap: "20px",
              paddingBottom: "20px",
            }}
            className="boxBodyRow"
          >
            <Form.Select size="sm" onChange={onTimePeriodSelected} defaultValue={3}>
              <option value={null}>Select period</option>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
            </Form.Select>
            <Form.Select size="sm" onChange={onTargetSelected} defaultValue={"weight"}>
              <option value={null}>Select target</option>
              <option value={"weight"}>Weight</option>
              <option value={"fitness_age"}>Age</option>
              <option value={"muscle_mass_perc"}>Muscle Mass Percentage</option>
              <option value={"fat_mass_perc"}>Fat Mass Percentage</option>
            </Form.Select>
          </div>
          <PlotContainer
            key="RadarPlot"
            title="Bio-Measurements"
            content={radarChart}
            height={size}
            width={size}
          />
          <Recommendataions 
            data={data}
            target={target}
          />
        </div>
        <div
          style={{ justifyContent: "center", gap: "40px" }}
          className="boxBodyColumn"
        >
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
  );
};
