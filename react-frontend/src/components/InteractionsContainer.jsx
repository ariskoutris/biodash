import "./InteractionsContainer.scss";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const target_to_string = {
  weight: "Weight",
  body_fat_perc: "Body Fat %",
  muscle_mass_perc: "Muscle Mass %",
  fitness_age: "Fitness Age",
  fat_mass_perc: "Fat Mass %",
};

export const InteractionsContainer = ({
  target,
  currentProjectedTarget,
  onTimePeriodSelected,
  onTargetSelected,
}) => {
  const [recommendataionTitles, setRecommendationTitles] = useState([]);
  const [recommendationButtonState, setRecommendationButtonState] = useState([
    false,
    false,
    false,
  ]);
  const [targetValue, setTargetValue] = useState(currentProjectedTarget);
  const [minTargetValue, setMinTargetValue] = useState(60);
  const [maxTargetValue, setMaxTargetValue] = useState(80);

  const onRecommendationClicked = (index) => {
    console.log(`Recommendation ${index} Clicked`);
    const newButtonState = recommendationButtonState.map((_, i) =>
      i === index ? true : false
    );
    setRecommendationButtonState(newButtonState);
  };

  // TODO: adjust recommendation based on new target value
  const onTargetValueChanged = (e) => {
    // call the backend to get the recommendations
    setRecommendationTitles([
      "Increase Workouts Per Week",
      "Increase Legs",
      "Increase Arms",
    ]);
    setTargetValue(parseInt(e.target.value));
  };

  const recommendationButtons = () => {
    if (targetValue === currentProjectedTarget) {
      return <caption>Move the slider to see recommendations</caption>;
    } else {
      return (
        <div style={{ justifyContent: "center", gap: "20px" }}>
          <div className="boxBodyRow">
            {recommendataionTitles.map((name, index) => (
              <Button
                className="recBtn"
                style={{ maxWidth: "150px", height: "70px" }}
                key={`${name}_${index}`}
                onClick={onRecommendationClicked}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="boxBodyRow">
      <div className="boxBodyColumn">
        <div className="boxBodyRow gap">
          <Form.Select
            size="sm"
            onChange={onTimePeriodSelected}
            defaultValue={3}
          >
            <option value={null}>Select period</option>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </Form.Select>
          <Form.Select
            size="sm"
            onChange={onTargetSelected}
            defaultValue={"weight"}
          >
            <option value={null}>Select target</option>
            <option value={"weight"}>Weight</option>
            <option value={"fitness_age"}>Age</option>
            <option value={"muscle_mass_perc"}>Muscle Mass Percentage</option>
            <option value={"fat_mass_perc"}>Fat Mass Percentage</option>
          </Form.Select>
        </div>
        <div className="boxBodyRow gap">
          <div className="boxBodyColumn">
            <Form.Range
              className="rangeSlider"
              value={targetValue}
              min={minTargetValue}
              max={maxTargetValue}
              onChange={onTargetValueChanged}
              tooltip="auto"
            />
            <p>Selected Value: {targetValue}kg</p>
          </div>
        </div>
      </div>
      <div className="boxBodyColumn">
        <div style={{ paddingBottom: "50px" }} className="boxBodyColumn">
          {`Recommendations for ${target_to_string[target]}`}
          {recommendationButtons()}
        </div>
      </div>
    </div>
  );
};
