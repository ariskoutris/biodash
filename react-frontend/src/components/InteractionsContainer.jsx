import "./InteractionsContainer.scss";
import { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import {
  getLabelFromTarget,
  getUnitsFromTarget,
  cleanLabel,
  getLabelFromKey,
  getTargetFromKey,
} from "../utils";
import { Button } from "react-bootstrap";
var _ = require("lodash");

export const InteractionsContainer = ({
  data,
  recData,
  target,
  period,
  minTargetValue,
  maxTargetValue,
  projectedTarget,
  initialTargetValue,
  timePeriodSelectHandler,
  targetSelectHandler,
  getRecommendations,
  handleRecommendationClick,
}) => {
  const [recommendationButtonState, setRecommendationButtonState] = useState([
    false,
    false,
    false,
  ]);
  const [targetValue, setTargetValue] = useState(initialTargetValue);

  useEffect(() => {
    setTargetValue(initialTargetValue);
  }, [initialTargetValue]);

  useEffect(() => {
    if (targetValue !== projectedTarget) {
      onSliderReleased();
    }

  // TODO: look into how to fix this dependency issue. When I add
  // the dependencies, I get some sort of recursion error.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const _resetRecommendations = useCallback(() => {
    setRecommendationButtonState([false, false, false]);
    handleRecommendationClick(false);
  }, [handleRecommendationClick]);

  const _resetTargetValue = () => {
    onTargetValueChanged({ target: { value: projectedTarget } });
  };

  const onRecommendationClicked = (value, index) => {
    const newButtonState = recommendationButtonState.map((val, i) =>
      i === index ? !val : false
    );
    handleRecommendationClick(newButtonState[index] && value);
    setRecommendationButtonState(newButtonState);
  };

  const onTargetValueChanged = async (e) => {
    const goal = Math.round(e.target.value);
    setTargetValue(goal);
  };

  const onSliderReleased = useCallback(async () => {
    _resetRecommendations();
    const predictedValue = Math.round(data.radar.predicted[target]);
    await getRecommendations(targetValue, predictedValue);
  }, [
    _resetRecommendations,
    data.radar.predicted,
    target,
    getRecommendations,
    targetValue,
  ]);

  const onPeriodSelected = async (e) => {
    _resetRecommendations();
    timePeriodSelectHandler(e, targetValue);
  };

  const onTargetSelected = (e) => {
    _resetRecommendations();
    _resetTargetValue();
    targetSelectHandler(e);
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
                {cleanLabel(value.title)} <br></br> {value.scale}
              </ToggleButton>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="boxBodyRow spaceChildren">
      <div className="boxBodyColumn">
        <div className="boxBodyRow gap spaceChildren">
          <Form.Select size="sm" onChange={onPeriodSelected} defaultValue={3}>
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
              <option key={key} value={getTargetFromKey(key)}>
                {getLabelFromKey(key)}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="boxBodyColumn">
          <div className="boxBodyRow gap">
            <Form.Range
              className="rangeSlider"
              value={targetValue}
              min={minTargetValue}
              max={maxTargetValue}
              onChange={onTargetValueChanged}
              onMouseUp={onSliderReleased}
              tooltip="auto"
            />
            <Button
              style={{ padding: "0.2rem 0.4rem", fontSize: "0.8rem" }}
              onClick={() => {
                _resetRecommendations();
                _resetTargetValue();
              }}
            >
              Reset
            </Button>
          </div>
          <div>
            <p style={{ marginBottom: 0 }}>
              Target Value: {targetValue} {getUnitsFromTarget(target)}
            </p>
            <p style={{ marginTop: 0 }}>
              Current Prediction: {projectedTarget} {getUnitsFromTarget(target)}
            </p>
          </div>
        </div>
      </div>
      <div className="boxBodyColumn">
        <div style={{ paddingBottom: "50px" }} className="boxBodyColumn">
          {`Recommendations for ${getLabelFromTarget(target)}`}
          {recommendationButtons()}
        </div>
      </div>
    </div>
  );
};
