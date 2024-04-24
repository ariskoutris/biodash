import "./mainPage.css"
import { useEffect, useState } from 'react';
import { PlotContainer } from "../../components/plotContainer/plotContainer";
import { Button } from "../../components/button/buttons";
import RadarChart from "../../components/plotContainer/RadarChart";
import ForecastPlot from "../../components/plotContainer/ForecastPlot";
import HorizontalBarPlot from "../../components/plotContainer/HorizontalBarPlot";




export const MainPage = ({data}) => {

    const [readyData , setReadyData] = useState()
    const [buttonState, setButtonState] = useState([false , true , false])
    const [showRecommendationButtons , setShowRecommendationButtons] = useState(false);
    const [recommendationButtonState, setRecommendationButtonState] = useState([false , false , false])

    useEffect(()=>{
        setReadyData(data)
    },[data])

    const onTimePeriodSelected =  (buttonPressed) => {
        return async (e)=>{
            e.stopPropagation();
            console.log(buttonPressed);
            // 1 button out of all is allowed
            setButtonState(old => old.map((_, index)=> index === buttonPressed))
            // here filter data based on period
            setReadyData(data.filter(()=>true))
        }
    }


    const onClickGenerate = (buttonPressed) => {
        return async (e) => {
            e.stopPropagation();
            // This is toggle single button
            setRecommendationButtonState(old => old.map((_state, index)=> index === buttonPressed ? !_state : _state))
            // and then filter based on it
            console.log('generate pressed');
        }
    }

    // make this also a state
    const [buttonNamesToGenerate, setButtonNamesToGenerate] = useState(['Increase Workouts Per Week', 'Increase Legs' , 'Increase Arms'])

    // this is a demo hook for the plot 
    const RadarPlotHook = (target) => {
        // set the buttons names to generate

        // setRecommendationButtonState into an array of the same size as the names so we don't overflow

        // set the showRecommendationButtons to true to display them

        // keep what was pressed
    }

    const buildButtonRecomendation = (name , index) =>  <Button style={{maxWidth : '150px' , height:"70px"}} key={`${name}_${index}`} content={name} onClick={onClickGenerate(index)} isPressed={recommendationButtonState[index]}/>
    const generateRecomendationBlock = (buttonNames=[]) => {
        return(
            <div style={{justifyContent: 'center' , gap:"20px" }} className="boxBodyRow">
                {buttonNames.map((name,index)=>buildButtonRecomendation(name,index))}
            </div>
        )
    }

    // if data not ready yet return empty
    if(!readyData) return <> </>
    

    const forecastPlot = <ForecastPlot data={data.line}/>
    const radarChart = <RadarChart data={data.radar}/>
    const barPlot = <HorizontalBarPlot data={data.bar}/>

    // otherwise build body
    return  (
    <div className="boxBody">
        <div style={{gap:"50px"}} className="boxBodyColumn">
            <div className="boxBodyRow">
                <div className="boxBodyColumn">
                    <PlotContainer key='RadarPlot' title="Bio-Measurements" content={radarChart} height="70%" width="70%" />
                    Time Period
                    <div style={{justifyContent: 'center' , gap:"20px" }} className="boxBodyRow">
                        <Button key='selectMonth1' content="1 month" onClick={onTimePeriodSelected(0)} isPressed={buttonState[0]}/>
                        <Button key='selectMonth2' content="3 month" onClick={onTimePeriodSelected(1)} isPressed={buttonState[1]}/>
                        <Button key='selectMonth3' content="6 month" onClick={onTimePeriodSelected(2)} isPressed={buttonState[2]}/>
                    </div>
                </div>
                <div style={{justifyContent: 'center' , gap:"40px" }} className="boxBodyColumn">
                        <PlotContainer key='ForecastPlot' title="Forecast" content={forecastPlot} height="70%" width="70%"/>
                        <PlotContainer key='BarPlot' title="Feature importance" content={barPlot} height="70%" width="70%"/>
                </div>
            </div>
            <div className="boxBodyRow">
                <div  className="boxBodyColumn">
                    <div style={{paddingBottom : "50px"}} className="boxBodyColumn">
                        Generate Recommendations
                        {showRecommendationButtons && generateRecomendationBlock(buttonNamesToGenerate)}
                        {!showRecommendationButtons && <Button content="Generate" onClick={()=>{setShowRecommendationButtons(true)}} /> }
                    
                    </div>
                    {showRecommendationButtons && (
                            // <div className="boxBodyRow"> 
                            //         <PlotContainer key='RadarPlot2' title="Bio-Measurements" content={radarChart}/>
                            //         <PlotContainer key='ForecastPlot2' title="Forecast" content={forecastPlot}/>
                            // </div>
                            true
                        )
                    }
                </div>
            </div>
        </div>
    </div>
    )
    
}