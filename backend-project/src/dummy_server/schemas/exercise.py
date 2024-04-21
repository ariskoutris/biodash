from marshmallow import Schema, fields


class ExerciseSchema(Schema):
    exercise = fields.String()
    equipment = fields.String()
    date = fields.Date()
    duration = fields.Integer()
    calories = fields.Integer()
    mets_min = fields.Float()
