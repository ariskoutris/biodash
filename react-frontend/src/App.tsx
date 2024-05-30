import "./App.scss";
import { MainPage } from "./pages/mainPage/mainPage";
import { useEffect, useState, useMemo } from "react";
import Button from "react-bootstrap/Button";
import { postPoints, userLogin } from "./router/resources/data";
import { getLineChartKeys, transformRecData } from "./utils";
import { Bar, ChartData, Line, LineData, Radar, TSPoint } from "./types/charts";
import {
  defaultBar,
  defaultChartData,
  defaultLine,
  defaultRadar,
} from "./defaults";
import { Recommendation, Recommendations } from "./types/recommendations";

function App() {
  const [data, setData] = useState<ChartData>(defaultChartData);
  const [lineData, setLineData] = useState<Line>(defaultLine);
  const [barData, setBarData] = useState<Bar>(defaultBar);
  const [recData, setRecData] = useState<Recommendations>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(3); // in months
  const [target, setTarget] = useState<string>("Weight");

  const radar_data = useMemo<Radar>(() => {
    if(lineData.predicted.Weight?.length == 0) return defaultRadar;
    const _radar_data : any = {
      current : Object.entries(lineData.predicted).map(([key, value]) => {
        return {
          [key]: value[0].value,
        };
      }).reduce((acc, curr) => { 
        return { ...acc, ...curr }
      }, {}),
      predicted: Object.entries(lineData.predicted).map(([key, value]) => {
        return {
          [key]: value[Math.floor(52 / 12 * period)].value,
        };
      }).reduce((acc, curr) => { 
        return { ...acc, ...curr }
      }, {})
    };
    if(!!lineData.recommended) {
      _radar_data["recommended"] = Object.entries(lineData.recommended).map(([key, value]) => {
        return {
          [key]: value.value,
        };
      }).reduce((acc, curr) => { 
        return { ...acc, ...curr }
      }, {});
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
      const _data = await postPoints(`line/${userId}/13`);
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
        `features/${userId}/${getLineChartKeys(target)}/13`
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
      radar: radar_data,
      line: lineData,
      bar: barData,
    });
  }, [radar_data, lineData, barData]);

  const getRecommendations = async (goal: number) => {
    await postPoints(
      `recommendations/${userId}/${getLineChartKeys(target)}/${goal}/${period}`
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
  }

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
