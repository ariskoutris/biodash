from marshmallow import Schema, fields


class ExerciseSchema(Schema):
    equipment_name = fields.String()
    duration = fields.Integer()
    calories = fields.Integer()
    mets_min = fields.Float()
