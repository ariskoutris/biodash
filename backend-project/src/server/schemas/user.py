from marshmallow import Schema, fields

from .biometric_data import BiometricDataSchema
from .exercise import ExerciseSchema, AggExerciseSchema


class UserSchema(Schema):
    biometric_data = fields.List(fields.Nested(BiometricDataSchema()))
    training_data = fields.List(fields.Nested(ExerciseSchema()))
    agg_training_data = fields.Nested(AggExerciseSchema())
    gender = fields.Str()
    age = fields.Int()