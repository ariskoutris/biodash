import pandas as pd
import os
from typing import Union, Optional


class DataPreprocessor:
    """
    Data Preprocessor class to preprocess the data before training the model.
    """
    def __init__(self, workout_data_path: Union[str, os.PathLike], timeseries_data_path: Union[str, os.PathLike], targets_path: Union[str, os.PathLike], legend_path: Union[str, os.PathLike, None] = None):
        """
        Initialize the DataPreprocessor class.
        :param workout_data_path: File path to the workout data.
        :param timeseries_data_path: File path to the timeseries data.
        :param targets_path: File path to the targets.
        :param legend_path: File path to the legend for the data, also including value constraints.
        """
        self.workout_data: pd.DataFrame = pd.read_excel(workout_data_path)
        self.timeseries_data: pd.DataFrame = pd.read_excel(timeseries_data_path)
        self.targets: pd.DataFrame = pd.read_excel(targets_path)
        self.legend: Optional[pd.DataFrame] = None
        if legend_path:
            self.legend = pd.read_excel(legend_path)
        self.data: Optional[pd.DataFrame] = None

    def extract_dataset(self):
        """
        Create the dataset by extracting the necessary info from the data.
        """
        if self.data is not None:
            return self.data
        self.data = self.__apply_constraints(self.__extract_data())

    def write_dataset(self, path: Union[str, os.PathLike]):
        """
        Write the dataset to a file.
        :param path: File path to save the dataset.
        """
        if self.data is not None:
            self.data.to_csv(path, index=False)
        return

    def __apply_constraints(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Apply constraints to the data if legend file is provided.
        :param data: Data to apply constraints to.
        :return: Data without samples that violate constraints.
        """
        if self.legend is None:
            return data
        # TODO: Remove constraint violations here
        pass
        return data

    def __extract_data(self) -> pd.DataFrame:
        """
        Extract the necessary data from the workout, timeseries and targets data.
        :return: A single dataset to train the model on.
        """
        # TODO: Preprocess data here
        pass
        return self.data
