import math
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
from darts.explainability.shap_explainer import ShapExplainer

import warnings
warnings.filterwarnings("ignore", message=".*X has feature names, but.*")

_data_store = {}

dirname = os.path.dirname(__file__)

model_path = os.path.join(dirname, "../weights/weight_model.pkl")
preprocessor_path = os.path.join(dirname, "../weights/weight_preprocessor.pkl")
scaler_path = os.path.join(dirname, "../weights/weight_scaler.pkl")
target_path = os.path.join(dirname, "../weights/weight_target.pkl")
past_cov_path = os.path.join(dirname, "../weights/weight_past_cov.pkl")
shap_explainer_path = os.path.join(dirname, "../weights/weight_shap_explainer.pkl")

model = RegressionModel.load(model_path)
preprocess_pipeline = pickle.load(open(preprocessor_path, 'rb'))
scaler = pickle.load(open(scaler_path, 'rb'))
target = pickle.load(open(target_path, 'rb'))
past_cov = pickle.load(open(past_cov_path, 'rb'))
shap_explainer = ShapExplainer(model, target, past_cov)

WEEKS_PER_MONTH = 4.2
MAX_MONTH = 5
MAX_HORIZON = 21

print("Model loaded")

def pad_timeseries(ts, pad_length):
    pad_values = pd.DataFrame(np.tile(ts.last_values(), (pad_length,1)))
    return ts.append_values(pad_values) 

def get_shap_values(shap_explainer, target, past_cov, horizons):
    
    explainability_res = shap_explainer.explain(target, past_cov,  horizons=horizons)
    comp_list = explainability_res.get_feature_values(horizons[0]).components.to_list()
    drop_comp_list = set([x for x in comp_list if any([x.startswith(y) for y in explainability_res.available_components])])

    importances_df = pd.DataFrame([])
    for horizon in horizons:
        if len(importances_df) == 0:
            importances_df = explainability_res.get_explanation(horizon).pd_dataframe().iloc[-1].T
        else:
            importances_df = pd.concat([importances_df, explainability_res.get_explanation(horizon).pd_dataframe().iloc[-1]], axis=1)
            
    importances_df.columns = horizons

    if isinstance(importances_df, pd.Series):
        importances_df = importances_df.to_frame()
        importances_df.columns = [horizons[0]]
    importances_df.reset_index(inplace=True)
    importances_df = importances_df[~importances_df['component'].isin(drop_comp_list)]

    importances_df = importances_df.T
    importances_df.columns = importances_df.iloc[0]
    importances_df = importances_df.drop(importances_df.index[0])
    importances_df.columns.name = 'Horizon'

    lag_columns = [col for col in importances_df.columns if 'lag-' in col]
    prefixes = set(col.rsplit('_', 1)[0] for col in lag_columns)

    for prefix in prefixes:
        lag_cols = [col for col in lag_columns if col.startswith(prefix)]
        importances_df[f'{prefix}'] = importances_df[lag_cols].mean(axis=1)
        
    importances_df = importances_df.drop(columns=lag_columns)
    return importances_df


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
    def predict_all_metrics(user_data):
        """
        Predict all metrics for the next MAX_HORIZON weeks.
        """
        # Placeholder for prediction logic using user data and time period

        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={'Gender': [gender], 'Age': [age]})
        
        exercise_data = user_data.get("agg_training_data", {})
        exercise_types = [x for x in exercise_data.keys() if x != 'week']
        weeks = pd.Index(exercise_data['week'])
        
        ex_ts = None
        for col in exercise_types:
            values = exercise_data[col]
            ts = TimeSeries.from_times_and_values(times=weeks, values=values, columns=[col], freq=1)
            ts = darts_fill_na(ts, fill=0.).astype(np.float32)
            if ex_ts is None:
                ex_ts = ts
            else:
                ex_ts = ex_ts.stack(ts)
        ex_ts = scaler.transform(ex_ts)

        response = {}
        for entry in biometric_data:
            weeks = pd.Index(entry['MeasuredOnWeek'])
            values = entry['Value']
            ts = TimeSeries.from_times_and_values(times=weeks, values=values, static_covariates=covs, freq=1)
            bm_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
            bm_ts = preprocess_pipeline.transform(bm_ts)
            
            interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
            intersected_bm_ts = bm_ts.slice_intersect(ex_ts)
            
            padded_ex_ts = pad_timeseries(interesected_ex_ts, 50)
            
            pred = model.predict(MAX_HORIZON, series=[intersected_bm_ts], past_covariates=[padded_ex_ts])
            unnorm_pred = preprocess_pipeline.inverse_transform(pred)[0]
            response[entry['BiometricName']] = unnorm_pred.values().flatten().tolist()[-1]

        return response

    @staticmethod
    def predict_metric_over_time(user_data, metric, period):
        """
        Predict the values of a specific metric over the specified time period.
        """
        
        if period > MAX_MONTH:
            raise ValueError(f"Period must be less than or equal to {MAX_MONTH} months")
        
        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={'Gender': [gender], 'Age': [age]})

        biometric_data = user_data.get("biometric_data", {})
        metric_data = [x for x in biometric_data if x['BiometricName'] == metric][0]

        weeks = pd.Index(metric_data['MeasuredOnWeek'])
        values = metric_data['Value']
        ts = TimeSeries.from_times_and_values(times=weeks, values=values, static_covariates=covs, freq=1)
        bm_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
        bm_ts = preprocess_pipeline.transform(bm_ts)
        
        exercise_data = user_data.get("agg_training_data", {})
        exercise_types = [x for x in exercise_data.keys() if x != 'week']
        weeks = pd.Index(exercise_data['week'])
        
        ex_ts = None
        for col in exercise_types:
            values = exercise_data[col]
            ts = TimeSeries.from_times_and_values(times=weeks, values=values, columns=[col], freq=1)
            ts = darts_fill_na(ts, fill=0.).astype(np.float32)
            if ex_ts is None:
                ex_ts = ts
            else:
                ex_ts = ex_ts.stack(ts)
        ex_ts = scaler.transform(ex_ts)
        
        interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
        intersected_bm_ts = bm_ts.slice_intersect(ex_ts)
        
        padded_ex_ts = pad_timeseries(interesected_ex_ts, 50)
                
        pred = model.predict(ceil(WEEKS_PER_MONTH * period), [intersected_bm_ts], [padded_ex_ts])
        unnorm_pred = preprocess_pipeline.inverse_transform(pred)[0]

        return [
            {
                "time": week,
                "value": value
            } for week, value in zip(range(ceil(WEEKS_PER_MONTH * period)), unnorm_pred.values().flatten().tolist())
        ]

    @staticmethod
    def calculate_feature_importances(user_id, metric):
        """
        Calculate feature importances for the specified metric.
        """
        
        user_data = BiometricsPredictor.get_user_data(user_id)
        
        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={'Gender': [gender], 'Age': [age]})

        biometric_data = user_data.get("biometric_data", {})
        metric_data = [x for x in biometric_data if x['BiometricName'] == metric][0]

        weeks = pd.Index(metric_data['MeasuredOnWeek'])
        values = metric_data['Value']
        ts = TimeSeries.from_times_and_values(times=weeks, values=values, static_covariates=covs, freq=1)
        bm_ts = darts_fill_na(ts, fill='auto').astype(np.float32)
        bm_ts = preprocess_pipeline.transform(bm_ts)
        
        exercise_data = user_data.get("agg_training_data", {})
        exercise_types = [x for x in exercise_data.keys() if x != 'week']
        weeks = pd.Index(exercise_data['week'])
        
        ex_ts = None
        for col in exercise_types:
            values = exercise_data[col]
            ts = TimeSeries.from_times_and_values(times=weeks, values=values, columns=[col], freq=1)
            ts = darts_fill_na(ts, fill=0.).astype(np.float32)
            if ex_ts is None:
                ex_ts = ts
            else:
                ex_ts = ex_ts.stack(ts)
        ex_ts = scaler.transform(ex_ts)
        
        interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
        intersected_bm_ts = bm_ts.slice_intersect(ex_ts)
        
        padded_ex_ts = pad_timeseries(interesected_ex_ts, 50)
        
        horizons =[ceil(WEEKS_PER_MONTH * i) for i in range(1, MAX_MONTH + 1)]
        shap_df = get_shap_values(shap_explainer, intersected_bm_ts, padded_ex_ts, horizons)
        shap_dict = shap_df.to_dict()
        return shap_dict
    
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
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(user_data, metric, period)
                },
                "2": {
                    "recommendation": "Cardio Time per week (minutes)",
                    "value": random.uniform(60, 300),
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(user_data, metric, period)
                },
                "3": {
                    "recommendation": "Calories per workout (kcal)",
                    "value": random.uniform(300, 800),
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(user_data, metric, period)
                }
            },
            "target": target,
            "metric": metric,
            "period": period,
        }
