import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";

import { Button } from "./button/buttons";

const target_to_string = {
  "weight": "Weight",
  "body_fat_perc": "Body Fat %",
  "muscle_mass_perc": "Muscle Mass %",
  "fitness_age": "Fitness Age",
}

export const Recommendataions = ({ data, target }) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendataionTitles, setRecommendationTitles] = useState([]);
  const [recommendationButtonState, setRecommendationButtonState] = useState([
    false,
    false,
    false,
  ]);
  const [targetValue, setTargetValue] = useState(72);
  const [minTargetValue, setMinTargetValue] = useState(60);
  const [maxTargetValue, setMaxTargetValue] = useState(80);

  useEffect(() => {
    if (target === null) {
      setShowRecommendations(false)
    }
  }, [target]);

  // TODO: turn this into an async API call eventually
  const onGenerateClicked = () => {
    // call the backend to get the recommendations
    setRecommendationTitles([
      "Increase Workouts Per Week",
      "Increase Legs",
      "Increase Arms",
    ]);
    setShowRecommendations(true);
    console.log("Generate Clicked");
    console.log(recommendataionTitles);
  };

  const onRecommendationClicked = (index) => {
    console.log(`Recommendation ${index} Clicked`);
    const newButtonState = recommendationButtonState.map((_, i) =>
      i === index ? true : false
    );
    setRecommendationButtonState(newButtonState);
  };

  // TODO: adjust recommendation based on new target value
  const onTargetValueChanged = (e) => {
    setTargetValue(e.target.value);
  }

  return (
    <>
      <div style={{ paddingBottom: "50px" }} className="boxBodyColumn">
        {target === null ? 
        "Please select a target metric above" :
        `Recommendations for ${target_to_string[target]}`}
        {!showRecommendations && (
          <Button 
            content="Generate" 
            onClick={onGenerateClicked}
            disabled={target === null}
          />
        )}
        {showRecommendations && (
          <div
            style={{ justifyContent: "center", gap: "20px" }}
          >
            <div style={{padding: "20px"}}>
              <Form.Range 
                value={targetValue}
                min={minTargetValue}
                max={maxTargetValue}
                onChange={onTargetValueChanged}
                tooltip='auto'
              />
              <p>Selected Value: {targetValue}kg</p>
            </div>
            <div className="boxBodyRow">
              {recommendataionTitles.map((name, index) => (
                <Button
                  style={{ maxWidth: "150px", height: "70px" }}
                  key={`${name}_${index}`}
                  content={name}
                  onClick={onRecommendationClicked}
                  isPressed={recommendationButtonState[index]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
