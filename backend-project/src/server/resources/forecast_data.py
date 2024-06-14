from flask import request
from flask_restful import Resource
from marshmallow import ValidationError

from ..models.biometrics_prediction import BiometricsPredictor
from ..schemas import UserSchema, RecommendationsAllSchema
import json
import os

dirname = os.path.dirname(__file__)

METRICS = ['Weight', 'Muscle Mass', 'Fat mass Perc', 'HR At Rest']

class PredictionsResource(Resource):
    """
    Receives user data and returns a unique identifier for later retrieval.
    """

    def post(self):
        request_data = request.get_json()
        try:
            # This is a dummy example. In a real case scenario we would have a database to query and get the actual
            # user data
            with open(
                os.path.join(dirname, f'users/{request_data["user_name"]}.json'), "r"
            ) as file:
                json_data = json.load(file)
                try:
                    user_data = UserSchema().load(json_data)
                except ValidationError as err:
                    return {"message": "Validation error", "errors": err.messages}, 400
        except FileNotFoundError:
            return {"message": "User ID not found"}, 400
        except json.JSONDecodeError:
            return {"message": "Corrupted file"}, 400

        # Save data and generate a user ID
        user_id = BiometricsPredictor.save_user_data(user_data)
        return {"user_id": user_id}, 201


class LineChartResource(Resource):
    """
    Uses a user ID to retrieve user data and generate line chart data for a specified metric and period.
    """

    def get(self, user_id, period):
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
        except KeyError:
            return {"message": "Invalid user ID"}, 404
        available_metrics = [
            x["BiometricName"] for x in user_data.get("biometric_data", {})
        ]
        line_chart_data = {"user_id": user_id, "period": period, "metrics": {}}
        for metric in available_metrics:
            if metric not in METRICS:
                continue
            line_chart_data["metrics"][metric] = (
                BiometricsPredictor.predict_metric_over_time(user_data, metric, period)
            )
        return line_chart_data, 200


class FeatureImportanceResource(Resource):
    """
    Uses a user ID to retrieve user data and generate feature importance data for a specified metric.
    """

    def get(self, user_id, metric, period):
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
        except KeyError:
            return {"message": "Invalid user ID"}, 404

        available_metrics = [
            x["BiometricName"] for x in user_data.get("biometric_data", {})
        ]
        if metric not in available_metrics:
            return {"message": f"{metric} metric unavailable for user"}, 400
        if metric not in METRICS:
            return {"message": f"{metric} metric not supported"}, 400

        importances = BiometricsPredictor.calculate_feature_importances(
            user_id=user_id, metric=metric
        )
        feature_importance_data = {
            "user_id": user_id,
            "metric": metric,
            "importances": importances,
        }
        return feature_importance_data, 200


class RecommendationsResource(Resource):
    """
    Uses a user ID to retrieve user data and generate recommendations for a specified metric, target and period.
    """

    def get(self, user_id, metric, period, target, predicted):
        """
        Get recommendations for a user based on their biometric data and their goals.
        :param user_id: user ID
        :param metric: Which metric to generate recommendations for
        :param period: In how many weeks should the goal be achieved
        :param target: What is the user's goal metric value
        :param predicted: What is the predicted value for the metric over the period
        :return: (recommendations, status code)
        """
        print(target, predicted)
        try:
            user_data = BiometricsPredictor.get_user_data(user_id)
        except KeyError:
            return {"message": "Invalid user ID"}, 404
        
        available_metrics = [
            x["BiometricName"] for x in user_data.get("biometric_data", {})
        ]
        if metric not in available_metrics:
            return {"message": f"{metric} metric unavailable for user"}, 400
        if metric not in METRICS:
            return {"message": f"{metric} metric not supported"}, 400
        
        recommendations = BiometricsPredictor.generate_recommendations(
            user_id=user_id, target=target, metric=metric, period=period, predicted=predicted
        )

        return recommendations, 200
