from marshmallow import Schema, fields

class BiometricDataSchema(Schema):
    BiometricName = fields.Str()
    MeasuredOnWeek = fields.List(fields.Int())
    Value = fields.List(fields.Float())
