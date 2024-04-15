import os

from joblib import dump, load
class ForecastModel:
    """
    Class to handle forecast models for all target types
    """

    # TODO: update targets with actual target names
    targets = ["weight", "fat_mass", "muscle_mass"]

    def __init__(self, weights_path: str = None):
        """
        Initialize the model
        :param weights_path: Path to the model weights file
        """
        # TODO: read weights or train model
        self.models = self.load(weights_path)

    def predict(self, data, target):
        """
        Predicts the target for the given data
        :param data: Data for which target is to be predicted
        :param target: Target to be predicted
        :return: Predicted value
        """
        return self.models[target].predict(data)

    def train(self, target):
        """
        Trains the model for a specific target
        :param target: Target for which model is to be trained
        """
        # TODO: load training data and preprocess it
        train_data = None
        # TODO: train model
        self.model[target].fit(train_data)

    def save(self, path, target):
        """
        Saves model wieghts for a specific target
        :param path: Path for weights
        :param target: Target for which weights are to be saved
        """
        dump(self.models[target], f"{path}/{target}.pt")

    def load(self, path):
        """
        Load model if weights are saved
        :param path: Path for weights
        """
        # TODO: initialize model class
        self.models = {target: None for target in self.targets}
        for target in self.targets:
            if path and os.path.exists(f"{path}/{target}.pt"):
                self.models[target] = load(f"{path}/{target}.pt")
            else:
                self.models[target].train()
