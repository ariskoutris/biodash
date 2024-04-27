import json
import random
from uuid import uuid4

_data_store = {}


class BiometricsPredictor:
    @staticmethod
    def save_user_data(user_data):
        """
        Save user data and return a unique user ID.
        """
        user_id = str(uuid4())  # Generate a unique identifier
        _data_store[user_id] = user_data
        return user_id

    @staticmethod
    def get_user_data(user_id):
        """
        Retrieve user data by user ID.
        """
        if user_id in _data_store:
            return _data_store[user_id]
        else:
            raise KeyError("user ID not found")

    @staticmethod
    def get_current_metrics(user_data):
        """
        Compute current metrics from user data.
        """
        # Placeholder for current user metrics calculation
        biometric_data = user_data.get("biometric_data", {})
        response = {
            key.replace("_", " ").title(): value
            for key, value in biometric_data.items()
        }
        return response

    @staticmethod
    def predict_all_metrics(user_data, period):
        """
        Predict all metrics for the given period based on user data.
        """
        # Placeholder for prediction logic using user data and time period
        biometric_data = user_data.get("biometric_data", {})
        response = {}
        if "weight" in biometric_data:
            response["Weight"] = biometric_data["weight"] * random.uniform(0.9, 1.1)
        if "muscle_mass_perc" in biometric_data:
            response["Muscle Mass Perc"] = biometric_data[
                "muscle_mass_perc"
            ] * random.uniform(0.9, 1.1)
        if "fat_mass_perc" in biometric_data:
            response["Fat Mass Perc"] = biometric_data[
                "fat_mass_perc"
            ] * random.uniform(0.9, 1.1)
        if "fitness_age" in biometric_data:
            response["Fitness Age"] = biometric_data["fitness_age"] + random.randint(
                -5, 5
            )
        return response

    @staticmethod
    def predict_metric_over_time(user_data, metric, period):
        """
        Predict the values of a specific metric over the specified time period.
        """
        # Simulating a time series prediction
        return [
            {
                "time": month,
                "value": user_data["biometric_data"][metric] * random.uniform(0.9, 1.1),
            }
            for month in range(1, period + 1)
        ]

    @staticmethod
    def calculate_feature_importances(user_data, metric, period):
        """
        Calculate feature importances for the specified metric and period.
        """
        # Placeholder logic for calculating feature importances
        return {
            "Workouts per Week": random.uniform(0.1, 0.5),
            "Calories per Workout": random.uniform(0.1, 0.5),
        }
