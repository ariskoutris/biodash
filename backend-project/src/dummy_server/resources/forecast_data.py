from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
import random
import json

from ..schemas import BiometricDataSchema, UserSchema


class ForecastResource(Resource):
    """
    Endpoint to predict biometric data
    """

    def get(self, id, duration):
        # Generate random data for demonstration
        data = {
            'id': id,
            'duration': duration,
            'Weight': random.uniform(50.0, 100.0),  # Random weight between 50 and 100 kg
            'Fat Mass': random.uniform(5.0, 25.0),  # Random fat mass percentage
            'Muscle Mass': random.uniform(30.0, 60.0),  # Random muscle mass percentage
            'Fitness Age': random.randint(20, 60)  # Random fitness age between 20 and 60
        }
        return data, 200  # Return the data and HTTP status 200 (OK)


    def post(self):
        """
        Predicts the biometric data for the given training data
        and current biometric data
        :return: Predicted biometric data
        """
        json_data = request.get_json()
        print(json.dumps(json_data, indent=4))
        try:
            # Load and validate JSON data against the schema
            user_data = UserSchema().load(json_data)
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400

        # TODO: Implement the prediction logic

        return BiometricDataSchema().dump(user_data["biometric_data"]), 200
