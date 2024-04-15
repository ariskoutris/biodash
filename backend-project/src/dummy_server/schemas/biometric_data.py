from marshmallow import Schema, fields


class BiometricDataSchema(Schema):
    weight = fields.Float()
    muscle_mass = fields.Float()
    fat_mass = fields.Float()
