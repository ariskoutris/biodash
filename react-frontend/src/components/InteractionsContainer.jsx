import "./InteractionsContainer.scss";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import { getTargetLabel, getTargetUnits } from "../utils";

export const InteractionsContainer = ({
  target,
  minTargetValue,
  maxTargetValue,
  projectedTarget,
  onTimePeriodSelected,
  onTargetSelected,
}) => {
  const [recommendataionTitles, setRecommendationTitles] = useState([]);
  const [recommendationButtonState, setRecommendationButtonState] = useState([
    false,
    false,
    false,
  ]);

  const [targetValue, setTargetValue] = useState(projectedTarget);

  const onRecommendationClicked = (index) => {
    const newButtonState = recommendationButtonState.map((val, i) =>
      i === index ? !val : val
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
    if (targetValue === projectedTarget) {
      return (
        <p style={{ color: "gray" }}>Move the slider to see recommendations</p>
      );
    } else {
      return (
        <div style={{ justifyContent: "center", gap: "20px" }}>
          <div className="boxBodyRow">
            {recommendataionTitles.map((name, index) => (
              <ToggleButton
                className="recBtn"
                style={{ maxWidth: "150px", height: "70px" }}
                key={`${name}_${index}`}
                onClick={() => onRecommendationClicked(index)}
                checked={recommendationButtonState[index]}
                type="checkbox"
              >
                {name}
              </ToggleButton>
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
            defaultValue={"Weight"}
          >
            <option value={null}>Select target</option>
            <option value={"Weight"}>Weight</option>
            <option value={"metabolic_age"}>Metabolic Age</option>
            <option value={"muscle_mass_perc"}>Muscle Mass Percentage</option>
            <option value={"fat_mass_perc"}>Fat Mass Percentage</option>
            <option value={"heart_rate_at_rest"}>Heart Rate at Rest</option>
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
            <p>
              Selected Value: {targetValue} {getTargetUnits(target)}
            </p>
          </div>
        </div>
      </div>
      <div className="boxBodyColumn">
        <div style={{ paddingBottom: "50px" }} className="boxBodyColumn">
          {`Recommendations for ${getTargetLabel(target)}`}
          {recommendationButtons()}
        </div>
      </div>
    </div>
  );
};
