from marshmallow import Schema, fields

from .biometric_data import BiometricDataSchema
from .exercise import ExerciseSchema


class UserSchema(Schema):
    biometric_data = fields.List(fields.Nested(BiometricDataSchema))
    training_data = fields.List(fields.Nested(ExerciseSchema))
    gender = fields.Str()
    age = fields.Int()

    # TODO: Aggregate raw training data (e.g. workouts per week, calories per workout, etc.)
    # agg_training_data = fields.Dict()
