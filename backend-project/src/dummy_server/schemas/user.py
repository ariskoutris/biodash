from marshmallow import Schema, fields

from .biometric_data import BiometricDataSchema
from .exercise import ExerciseSchema


class UserSchema(Schema):
    biometric_data = fields.Nested(BiometricDataSchema)
    training_data = fields.List(fields.Nested(ExerciseSchema))
