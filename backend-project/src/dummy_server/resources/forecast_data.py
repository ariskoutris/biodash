from flask import request
from flask_restful import Resource
from marshmallow import ValidationError

from ..schemas import BiometricDataSchema, UserSchema


class ForecastResource(Resource):
    """
    Endpoint to predict biometric data
    """

    def post(self):
        """
        Predicts the biometric data for the given training data
        and current biometric data
        :return: Predicted biometric data
        """
        json_data = request.get_json()
        try:
            # Load and validate JSON data against the schema
            user_data = UserSchema().load(json_data)
        except ValidationError as err:
            return {"message": "Validation error", "errors": err.messages}, 400

        # TODO: Implement the prediction logic

        return BiometricDataSchema().dump(user_data["biometric_data"]), 200
