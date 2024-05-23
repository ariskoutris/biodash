import random
from uuid import uuid4
import pickle
import numpy as np
import pandas as pd
from math import ceil
import os

from darts.timeseries import TimeSeries
from darts.models import RegressionModel
from darts.utils.missing_values import fill_missing_values as darts_fill_na

_data_store = {}

dirname = os.path.dirname(__file__)
model_path = os.path.join(dirname, "../weights/weight_model.pkl")
preprocessor_path = os.path.join(dirname, "../weights/weight_preprocessor.pkl")
model = RegressionModel.load(model_path)
preprocess_pipeline = pickle.load(open(preprocessor_path, 'rb'))
WEEKS_PER_MONTH = 4.345
print("Model loaded")


def create_and_fill_timeseries(row):
    times = pd.Index(row['MeasuredOnWeek'])
    values = row['Value']
    covs = pd.DataFrame(data={'Gender': [row['Gender']], 'Age': [row['Age']]})
    ts = TimeSeries.from_times_and_values(times=times, values=values, static_covariates=covs, freq=1)
    filled_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
    return filled_ts


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
        response = {x['BiometricName']: x['Value'][-1] for x in biometric_data}
        return response

    @staticmethod
    def predict_all_metrics(user_data, period):
        """
        Predict all metrics for the given period based on user data.
        """
        # Placeholder for prediction logic using user data and time period

        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={'Gender': [gender], 'Age': [age]})

        response = {}
        for entry in biometric_data:
            weeks = pd.Index(entry['MeasuredOnWeek'])
            values = entry['Value']
            ts = TimeSeries.from_times_and_values(times=weeks, values=values, static_covariates=covs, freq=1)
            filled_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
            trans_ts = preprocess_pipeline.transform(filled_ts)
            pred = model.predict(4 * period, [trans_ts])
            unnorm_pred = preprocess_pipeline.inverse_transform(pred)[0]
            response[entry['BiometricName']] = unnorm_pred.values().flatten().tolist()[-1]

        return response

    @staticmethod
    def predict_metric_over_time(user_data, metric, period):
        """
        Predict the values of a specific metric over the specified time period.
        """
        # Simulating a time series prediction
        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={'Gender': [gender], 'Age': [age]})

        biometric_data = user_data.get("biometric_data", {})
        metric_data = [x for x in biometric_data if x['BiometricName'] == metric][0]

        weeks = pd.Index(metric_data['MeasuredOnWeek'])
        values = metric_data['Value']
        ts = TimeSeries.from_times_and_values(times=weeks, values=values, static_covariates=covs, freq=1)
        filled_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
        trans_ts = preprocess_pipeline.transform(filled_ts)
        pred = model.predict(ceil(WEEKS_PER_MONTH * period), [trans_ts])
        unnorm_pred = preprocess_pipeline.inverse_transform(pred)[0]

        return [
            {
                "time": week,
                "value": value
            } for week, value in zip(range(1, 4 * period + 1), unnorm_pred.values().flatten().tolist())
        ]

    @staticmethod
    def calculate_feature_importances(user_id, metric, period):
        """
        Calculate feature importances for the specified metric and period.
        """
        # Placeholder logic for calculating feature importances
        return {
            "Workouts per Week": [random.uniform(0.1, 0.5) for _ in range(ceil(WEEKS_PER_MONTH * period))],
            "Calories per Workout": [random.uniform(0.1, 0.5) for _ in range(ceil(WEEKS_PER_MONTH * period))],
        }

    @staticmethod
    def generate_recommendations(user_id, metric, target, period):
        """
        Calculate feature importances for the specified metric, desired target and period.
        """
        # Placeholder logic for generating recommendations for the user with the defined target
        user_data = BiometricsPredictor.get_user_data(user_id)

        return {
            "user_id": user_id,
            "recommendations": {
                "1": {
                    "recommendation": "Leg workouts per week",
                    "value": random.uniform(1, 5),
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, period)
                },
                "2": {
                    "recommendation": "Cardio Time per week (minutes)",
                    "value": random.uniform(60, 300),
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, period)
                },
                "3": {
                    "recommendation": "Calories per workout (kcal)",
                    "value": random.uniform(300, 800),
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, period)
                }
            },
            "target": target,
            "metric": metric,
            "period": period,
        }
