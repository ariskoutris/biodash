import "./App.scss";
import { MainPage } from "./pages/mainPage/mainPage";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { postPoints, sendData } from "./router/resources/data";
import { getLineChartKeys, transformRecData } from "./utils";
import { Bar, ChartData, Line, LineData, Radar } from "./types/charts";
import {
  defaultBar,
  defaultChartData,
  defaultLine,
  defaultRadar,
} from "./defaults";
import { Recommendation, Recommendations } from "./types/recommendations";

function App() {
  const [data, setData] = useState<ChartData>(defaultChartData);
  const [radarData, setRadarData] = useState<Radar>(defaultRadar);
  const [lineData, setLineData] = useState<Line>(defaultLine);
  const [barData, setBarData] = useState<Bar>(defaultBar);
  const [recData, setRecData] = useState<Recommendations>([]);

  const [userId, setUserId] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(3); // in months
  const [target, setTarget] = useState<string>("Weight");

  // here fetch and set the data
  const _onImportClick = async (e: any) => {
    e.stopPropagation();
    const _id = (await sendData()) as any;
    setUserId(_id || false);
  };

  useEffect(() => {
    const getRadar = async () => {
      const _data = await postPoints(`radar/${userId}/${period}`);
      setRadarData(_data as Radar);
    };

    if (userId) {
      getRadar().catch((e) => {
        console.error(e);
        setRadarData(defaultRadar);
      });
    }
  }, [period, userId]);

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
        `features/${userId}/${getLineChartKeys(target)}/5`
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
          <Button onClick={_onImportClick}>Import Data</Button>
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
