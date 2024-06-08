import os
import pickle
from darts.models import RegressionModel
from darts.explainability import ShapExplainer

class ModelLoader:
    def __init__(self, dirname, target_bm):
        self.dirname = dirname
        self.target_bm = target_bm
        self.weights_dir = os.path.join(self.dirname, self.target_bm)
        
        self.model_path = os.path.join(self.weights_dir, "model.pkl")
        self.preprocessor_path = os.path.join(self.weights_dir, "preprocessor.pkl")
        self.scaler_path = os.path.join(self.weights_dir, "scaler.pkl")
        self.target_path = os.path.join(self.weights_dir, "target.pkl")
        self.past_cov_path = os.path.join(self.weights_dir, "past_cov.pkl")
        
        self.model = None
        self.preprocess_pipeline = None
        self.scaler = None
        self.target = None
        self.past_cov = None
        self.shap_explainer = None

    def load(self):
        self.model = RegressionModel.load(self.model_path)
        self.preprocess_pipeline = pickle.load(open(self.preprocessor_path, "rb"))
        self.scaler = pickle.load(open(self.scaler_path, "rb"))
        self.target = pickle.load(open(self.target_path, "rb"))
        self.past_cov = pickle.load(open(self.past_cov_path, "rb"))
        self.shap_explainer = ShapExplainer(self.model, self.target, self.past_cov)
    
    def model(self):
        return self.model

    def preprocess_pipeline(self):
        return self.preprocess_pipeline

    def scaler(self):
        return self.scaler

    def target(self):
        return self.target

    def past_cov(self):
        return self.past_cov

    def shap_explainer(self):
        return self.shap_explainer