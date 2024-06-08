from uuid import uuid4
import numpy as np
import pandas as pd
from math import ceil
import os

from darts.timeseries import TimeSeries
from darts.utils.missing_values import fill_missing_values as darts_fill_na

from .model import ModelLoader
import warnings

warnings.filterwarnings("ignore", message=".*X has feature names, but.*")

_data_store = {}
_feature_importances = {}
models = {}

file_dir = os.path.dirname(__file__)
par_dir = os.path.abspath(os.path.join(file_dir, os.pardir))
weights_dir = os.path.join(par_dir, "weights")

models["Weight"] = ModelLoader(weights_dir, "Weight")
models["Muscle Mass"] = ModelLoader(weights_dir, "Muscle Mass")
models["Fat mass Perc"] = ModelLoader(weights_dir, "Fat mass Perc")
models["Weight"].load()
models["Muscle Mass"].load()
models["Fat mass Perc"].load()

WEEKS_PER_MONTH = 4.2
MAX_MONTH = 5
MAX_HORIZON = 21

print("Model loaded")


def pad_timeseries(ts, pad_length, feature_adjustments=None):
    pad_ts = ts.last_values()
    feature_names = ts.columns.tolist()
    if feature_adjustments:
        feature, adjustment = feature_adjustments
        feature_stripped = "_".join(feature.split("_")[:-1])
        index = feature_names.index(feature_stripped)
        pad_ts[index] += adjustment
    pad_values = pd.DataFrame(np.tile(pad_ts, (pad_length, 1)))
    return ts.append_values(pad_values)


def get_shap_values(shap_explainer, target, past_cov, horizons):
    explainability_res = shap_explainer.explain(target, past_cov, horizons=horizons)
    comp_list = explainability_res.get_feature_values(horizons[0]).components.to_list()
    drop_comp_list = set(
        [
            x
            for x in comp_list
            if any([x.startswith(y) for y in explainability_res.available_components])
        ]
    )

    importances_df = pd.DataFrame([])
    for horizon in horizons:
        if len(importances_df) == 0:
            importances_df = (
                explainability_res.get_explanation(horizon).pd_dataframe().iloc[-1].T
            )
        else:
            importances_df = pd.concat(
                [
                    importances_df,
                    explainability_res.get_explanation(horizon).pd_dataframe().iloc[-1],
                ],
                axis=1,
            )

    importances_df.columns = horizons

    if isinstance(importances_df, pd.Series):
        importances_df = importances_df.to_frame()
        importances_df.columns = [horizons[0]]
    importances_df.reset_index(inplace=True)
    importances_df = importances_df[~importances_df["component"].isin(drop_comp_list)]

    importances_df = importances_df.T
    importances_df.columns = importances_df.iloc[0]
    importances_df = importances_df.drop(importances_df.index[0])
    importances_df.columns.name = "Horizon"

    lag_columns = [col for col in importances_df.columns if "lag-" in col]
    prefixes = set(col.rsplit("_", 1)[0] for col in lag_columns)

    for prefix in prefixes:
        lag_cols = [col for col in lag_columns if col.startswith(prefix)]
        importances_df[f"{prefix}"] = importances_df[lag_cols].mean(axis=1)

    importances_df = importances_df.drop(columns=lag_columns)
    return importances_df


def preprocess_exercise_data(exercise_data, scaler):
    exercise_types = [x for x in exercise_data.keys() if x != "week"]
    weeks = pd.Index(exercise_data["week"])

    ex_ts = None
    for col in exercise_types:
        values = exercise_data[col]
        ts = TimeSeries.from_times_and_values(
            times=weeks, values=values, columns=[col], freq=1
        )
        ts = darts_fill_na(ts, fill=0.0).astype(np.float32)
        if ex_ts is None:
            ex_ts = ts
        else:
            ex_ts = ex_ts.stack(ts)
    return scaler.transform(ex_ts)


def preprocess_biometric_data(biometric_data, covs, preprocessor, metric=None):
    if metric:
        metric_data = [x for x in biometric_data if x["BiometricName"] == metric][0]
    else:
        metric_data = biometric_data

    weeks = pd.Index(metric_data["MeasuredOnWeek"])
    values = metric_data["Value"]
    ts = TimeSeries.from_times_and_values(
        times=weeks, values=values, static_covariates=covs, freq=1
    )
    bm_ts = darts_fill_na(ts, fill="auto").astype(np.float32)
    return preprocessor.transform(bm_ts)


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
        biometric_data = user_data.get("biometric_data", {})
        return {x["BiometricName"]: x["Value"][-1] for x in biometric_data}

    @staticmethod
    def predict_all_metrics(user_data, feature_adjustments=None, period=None):
        """
        Predict all metrics for the next MAX_HORIZON weeks.
        """
        biometric_data = user_data.get("biometric_data", {})
        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={"Gender": [gender], "Age": [age]})   
        week = MAX_HORIZON if period is None else ceil(WEEKS_PER_MONTH * period)

        response = {}
        for entry in biometric_data:
            metric = entry["BiometricName"]
            
            ex_ts = preprocess_exercise_data(user_data.get("agg_training_data", {}), models[metric].scaler)
            bm_ts = preprocess_biometric_data(entry, covs, models[metric].preprocess_pipeline)
            interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
            intersected_bm_ts = bm_ts.slice_intersect(ex_ts)

            padded_ex_ts = pad_timeseries(ts=interesected_ex_ts, pad_length=50)
            if feature_adjustments:
                ex_df = padded_ex_ts.pd_dataframe()
                for feature, adjustment in feature_adjustments:
                    feature_stripped = "_".join(feature.split("_")[:-1])
                    ex_df[feature_stripped] += adjustment
                padded_ex_ts = TimeSeries.from_dataframe(ex_df)
            pred = models[metric].model.predict(
                week, series=[intersected_bm_ts], past_covariates=[padded_ex_ts]
            )
            unnorm_pred = models[metric].preprocess_pipeline.inverse_transform(pred)[0]
            response[entry["BiometricName"]] = (
                unnorm_pred.values().flatten().tolist()[-1]
            )

        return response

    @staticmethod
    def predict_metric_over_time(user_data, metric, period, feature_adjustments=None):
        """
        Predict the values of a specific metric over the specified time period.
        """
        if period > MAX_MONTH:
            raise ValueError(f"Period must be less than or equal to {MAX_MONTH} months")

        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={"Gender": [gender], "Age": [age]})

        bm_ts = preprocess_biometric_data(
            user_data.get("biometric_data", {}), covs, models[metric].preprocess_pipeline, metric
        )
        ex_ts = preprocess_exercise_data(user_data.get("agg_training_data", {}), models[metric].scaler)

        interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
        intersected_bm_ts = bm_ts.slice_intersect(ex_ts)

        padded_ex_ts = pad_timeseries(ts=interesected_ex_ts, pad_length=50)
        if feature_adjustments:
            ex_df = padded_ex_ts.pd_dataframe()
            for feature, adjustment in feature_adjustments:
                feature_stripped = "_".join(feature.split("_")[:-1])
                ex_df[feature_stripped] += adjustment
            padded_ex_ts = TimeSeries.from_dataframe(ex_df)
        pred = models[metric].model.predict(
            ceil(WEEKS_PER_MONTH * period), [intersected_bm_ts], [padded_ex_ts]
        )
        unnorm_pred = models[metric].preprocess_pipeline.inverse_transform(pred)[0]

        return [
            {"time": week, "value": value}
            for week, value in zip(
                range(ceil(WEEKS_PER_MONTH * period)),
                unnorm_pred.values().flatten().tolist(),
            )
        ]

    @staticmethod
    def calculate_feature_importances(user_id, metric):
        
        if user_id in _feature_importances and metric in _feature_importances[user_id]:
            return _feature_importances[user_id][metric]
        
        user_data = BiometricsPredictor.get_user_data(user_id)

        age = user_data.get("age")
        gender = user_data.get("gender")
        covs = pd.DataFrame(data={"Gender": [gender], "Age": [age]})

        bm_ts = preprocess_biometric_data(
            user_data.get("biometric_data", {}), covs, models[metric].preprocess_pipeline, metric
        )
        ex_ts = preprocess_exercise_data(user_data.get("agg_training_data", {}), models[metric].scaler)

        interesected_ex_ts = ex_ts.slice_intersect(bm_ts)
        intersected_bm_ts = bm_ts.slice_intersect(ex_ts)

        padded_ex_ts = pad_timeseries(interesected_ex_ts, 50)

        horizons = [ceil(WEEKS_PER_MONTH * i) for i in range(1, MAX_MONTH + 1)]
        shap_df = get_shap_values(
            models[metric].shap_explainer, intersected_bm_ts, padded_ex_ts, horizons
        )
        
        shap_dict = shap_df.to_dict()
        
        if user_id not in _feature_importances:
            _feature_importances[user_id] = {}  
        _feature_importances[user_id][metric] = shap_dict
        return shap_dict

    @staticmethod
    def generate_recommendations(user_id, metric, period, target, predicted):
        """
        Calculate feature importances for the specified metric, desired target and period.
        """
        user_data = BiometricsPredictor.get_user_data(user_id)
        
        #TODO: Inverse transform feature importances.
        feature_importances_dict = _feature_importances[user_id][metric]
        feature_importances = [(key, feature_importances_dict[key][int(ceil(WEEKS_PER_MONTH * period))]) for key in feature_importances_dict.keys()]
        feature_importances = [(k,v) for k,v in feature_importances if "statcov" not in k]
        
        increase_flag = target > predicted
        
        feature_importances.sort(key=lambda x: x[1], reverse=increase_flag)
    
        top_features = feature_importances[:3]
        
        names = [x[0] for x in top_features]
        importances = [x[1] for x in top_features]

        scaling_factor = abs(target - predicted) / abs(target + predicted)
        feature_adjustments = [(x[0], scaling_factor * 100) for x in top_features]

        return {
            "user_id": user_id,
            "recommendations": {
                "1": {
                    "recommendation": names[0],
                    "value": importances[1],
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, [feature_adjustments[0]], period=period),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(
                        user_data, metric, period, [feature_adjustments[0]]
                    ),
                },
                "2": {
                    "recommendation": names[1],
                    "value": importances[1],
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, [feature_adjustments[1]], period=period),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(
                        user_data, metric, period, [feature_adjustments[1]]
                    ),
                },
                "3": {
                    "recommendation": names[2],
                    "value": importances[1],
                    "new_metrics": BiometricsPredictor.predict_all_metrics(user_data, [feature_adjustments[2]], period=period),
                    "new_ts": BiometricsPredictor.predict_metric_over_time(
                        user_data, metric, period, [feature_adjustments[2]]
                    ),
                },
            },
            "target": target,
            "metric": metric,
            "period": period,
        }
