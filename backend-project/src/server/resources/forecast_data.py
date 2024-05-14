from flask import request
from flask_restful import Resource
from marshmallow import ValidationError

from ..models.biometrics_prediction import BiometricsPredictor
from ..schemas import UserSchema


class PredictionsResource(Resource):
    """
    Receives user data and returns a unique identifier for later retrieval.
    """

    def post(self):
        json_data = request.get_json()
        try:
            user_data = UserSchema().load(json_data)
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400

        # Save data and generate a user ID
        user_id = BiometricsPredictor.save_user_data(user_data)
        return {"user_id": user_id}, 201


class RadarChartResource(Resource):
    """
    Uses a user ID to retrieve and process user data for radar chart visualization.
    """

    def get(self, user_id, period):
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
        except KeyError:
            return {"message": "Invalid user ID"}, 404

        current_metrics = BiometricsPredictor.get_current_metrics(user_data)
        predicted_metrics = BiometricsPredictor.predict_all_metrics(user_data, period)
        radar_data = {"current": current_metrics, "predicted": predicted_metrics}
        return radar_data, 200


class LineChartResource(Resource):
    """
    Uses a user ID to retrieve user data and generate line chart data for a specified metric and period.
    """

    def get(self, user_id, metric, period):
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
        except KeyError:
            return {"message": "Invalid user ID"}, 404
        available_metrics = [x["BiometricName"] for x in user_data.get("biometric_data", {})]
        if metric not in available_metrics:
            return {"message": f"{metric} metric unavailable for user"}, 400
        time_series_prediction = BiometricsPredictor.predict_metric_over_time(
            user_data, metric, period
        )
        line_chart_data = {
            "metric": metric,
            "period": period,
            "time_series": time_series_prediction,
        }
        return line_chart_data, 200


class FeatureImportanceResource(Resource):
    """
    Uses a user ID to retrieve user data and generate feature importance data for a specified metric.
    """

    def get(self, user_id, metric, period):
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
            importances = BiometricsPredictor.calculate_feature_importances(
                user_data, metric, period
            )
        except KeyError:
            return {"message": "Invalid user ID"}, 404

        available_metrics = [x["BiometricName"] for x in user_data.get("biometric_data", {})]
        if metric not in available_metrics:
            return {"message": f"{metric} metric unavailable for user"}, 400

        feature_importance_data = {
            "metric": metric,
            "period": period,
            "importances": importances,
        }
        return feature_importance_data, 200
