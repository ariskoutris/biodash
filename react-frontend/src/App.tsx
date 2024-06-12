import "./App.scss";
import { MainPage } from "./pages/mainPage/mainPage";
import { useEffect, useState, useMemo } from "react";
import Button from "react-bootstrap/Button";
import { postPoints, userLogin } from "./router/resources/data";
import { getKeyFromTarget, transformRecData } from "./utils";
import { Bar, ChartData, Line, LineData, Radar } from "./types/charts";
import {
  defaultBar,
  defaultChartData,
  defaultLine,
  defaultRadar,
} from "./defaults";
import { Recommendation, Recommendations } from "./types/recommendations";
var _ = require("lodash");

function App() {
  const [data, setData] = useState<ChartData>(defaultChartData);
  const [lineData, setLineData] = useState<Line>(defaultLine);
  const [barData, setBarData] = useState<Bar>(defaultBar);
  const [recData, setRecData] = useState<Recommendations>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(3); // in months
  const [target, setTarget] = useState<string>("Weight");

  const radarData = useMemo<Radar>(() => {
    if (lineData.predicted.Weight?.length === 0) return defaultRadar;
    
    const periodInWeeks = Math.ceil(4.2 * period) - 1
    const getTargetValue = (data: any, period: any) => {
      return _.mapValues(data, (value: any) => value[period]?.value);
    }
    const _radar_data: any = {
      current: getTargetValue(lineData.predicted, 0),
      predicted: getTargetValue(lineData.predicted, periodInWeeks),
    };
    if (lineData.recommended) {
      _radar_data["recommended"] = getTargetValue(lineData.recommended, periodInWeeks)
    }
    return _radar_data;
  }, [lineData, period]);

  // here fetch and set the data
  const _onLoginClick = async (e: any) => {
    e.stopPropagation();
    const _id = (await userLogin("dummy", "wowpassword")) as any;
    setUserId(_id || false);
  };

  useEffect(() => {
    const getLine = async () => {
      // data is fetched for 1 year
      const _data = await postPoints(`line/${userId}/5`);
      if (_data) {
        setLineData({
          predicted: _data.metrics as LineData,
        });
      } else {
        setLineData(defaultLine);
      }
    };

    if (userId) {
      getLine().catch((e) => {
        console.error(e);
        setLineData(defaultLine);
      });
    }
  }, [userId]);

  useEffect(() => {
    const getBar = async () => {
      const _data = await postPoints(
        `features/${userId}/${getKeyFromTarget(target)}/5`
      );
      setBarData((_data?.importances as Bar) || defaultBar);
    };

    if (userId) {
      getBar().catch((e) => {
        console.error(e);
        setBarData(defaultBar);
      });
    }
  }, [target, userId]);

  useEffect(() => {
    setData({
      radar: radarData,
      line: lineData,
      bar: barData,
    });
  }, [radarData, lineData, barData]);

  const getRecommendations = async (goal: number, predicted: number) => {
    setRecData([]);
    await postPoints(
      `recommendations/${userId}/${getKeyFromTarget(
        target
      )}/${period}/${goal}/${predicted}`
    )
      .then((data) => {
        console.log("recData", data);
        setRecData(transformRecData(data));
        return data;
      })
      .catch((e) => {
        console.error(e);
        setRecData([]);
      });
  };

  const handleRecommendationClick = (rec: Recommendation) => {
    let newData = { ...data };
    if (rec) {
      newData.line.recommended = rec.new_ts || undefined;
      newData.radar.recommended = rec.new_metrics || undefined;
    } else {
      delete newData.line.recommended;
      delete newData.radar.recommended;
    }
    setData(newData);
  };

  return (
    <div className="App">
      <div className="headerContainer">
        <div className="headerContainerItem">
          <img
            className="headerContainerItem"
            src={require("./assets/technogym_logo_vector.png")}
            alt="Technogym Logo"
          />
        </div>
        <header className="App-header"> TechnoGym Assistant </header>
        <div className="headerContainerItem">
          <Button onClick={_onLoginClick}>Login</Button>
        </div>
      </div>
      <MainPage
        data={data}
        recData={recData}
        period={period}
        setPeriod={setPeriod}
        target={target}
        setTarget={setTarget}
        getRecommendations={getRecommendations}
        handleRecommendationClick={handleRecommendationClick}
      />
    </div>
  );
}

export default App;
