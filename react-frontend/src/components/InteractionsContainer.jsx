import "./InteractionsContainer.scss";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import { getTargetFromLabel, getTargetLabel, getTargetUnits } from "../utils";
var _ = require('lodash');

export const InteractionsContainer = ({
  data,
  recData,
  target,
  minTargetValue,
  maxTargetValue,
  projectedTarget,
  onTimePeriodSelected,
  onTargetSelected,
  getRecommendations,
  handleRecommendationClick,
}) => {
  const [recommendationButtonState, setRecommendationButtonState] = useState([
    false,
    false,
    false,
  ]);
  const [targetValue, setTargetValue] = useState(projectedTarget);

  useEffect(() => {
    setTargetValue(projectedTarget);
  }, [projectedTarget]);

  const onRecommendationClicked = (value, index) => {
    console.log(index, recommendationButtonState)
    const newButtonState = recommendationButtonState.map((val, i) =>
      i === index ? !val : false
    );
    handleRecommendationClick(newButtonState[index] && value)
    setRecommendationButtonState(newButtonState);
  };

  const onTargetValueChanged = async (e) => {
    const goal = Math.round(e.target.value);
    setTargetValue(goal);
    const predictedValue = Math.round(data.radar.predicted[target]);
    await getRecommendations(goal, predictedValue);
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
            {_.map(recData, (value, index) => (
              <ToggleButton
                className="recBtn"
                style={{ maxWidth: "150px", height: "70px" }}
                key={value.title}
                onClick={() => onRecommendationClicked(value, index)}
                checked={recommendationButtonState[index]}
                type="checkbox"
              >
                {value.title}
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
            {_.range(1, 6).map((num) => (
              <option key={num} value={num}>
                {num} Months
              </option>
            ))}
          </Form.Select>
          <Form.Select
            size="sm"
            onChange={onTargetSelected}
            defaultValue={"Weight"}
          >
            {_.map(data.radar.current, (_, key) => (
              <option key={key} value={getTargetFromLabel(key)}>
                {key}
              </option>
            ))}
            {/* <option value={"Weight"}>Weight</option>
            <option value={"metabolic_age"}>Metabolic Age</option>
            <option value={"muscle_mass_perc"}>Muscle Mass Percentage</option>
            <option value={"fat_mass_perc"}>Fat Mass Percentage</option>
            <option value={"heart_rate_at_rest"}>Heart Rate at Rest</option> */}
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
