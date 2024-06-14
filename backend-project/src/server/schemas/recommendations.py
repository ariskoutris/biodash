from marshmallow import Schema, fields

from .biometric_data import BiometricDataSchema


class RecommendationSchema(Schema):
    recommendation = fields.Dict(keys=fields.Str(), values=fields.Float())
    new_metrics = fields.Nested(BiometricDataSchema())


class RecommendationsAllSchema(Schema):
    user_id = fields.Str(required=True)
    recommendations = fields.Dict(keys=fields.Str(), values=fields.Nested(RecommendationSchema()))
    target = fields.Str()
    metric = fields.Str()
    period = fields.Str()
