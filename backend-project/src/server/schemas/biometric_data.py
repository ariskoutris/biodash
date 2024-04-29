from marshmallow import Schema, fields


class BiometricDataSchema(Schema):
    weight = fields.Float()
    muscle_mass_perc = fields.Float()
    fat_mass_perc = fields.Float()
    fitness_age = fields.Integer()
