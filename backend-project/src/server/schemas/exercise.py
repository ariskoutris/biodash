from marshmallow import Schema, fields


class ExerciseSchema(Schema):
    exercise = fields.String()
    equipment = fields.String()
    date = fields.Date()
    duration = fields.Integer()
    calories = fields.Integer()
    mets_min = fields.Float()

class AggExerciseSchema(Schema):
    week = fields.List(fields.Integer())
    total_calories_week = fields.List(fields.Float())
    total_minutes_week = fields.List(fields.Integer())
    cardio_calories_week = fields.List(fields.Float())
    cardio_minutes_week = fields.List(fields.Float())
    isotonic_calories_week = fields.List(fields.Float())
    isotonic_minutes_week = fields.List(fields.Float())
    avg_duration_per_workout = fields.List(fields.Float())
    avg_calories_per_workout = fields.List(fields.Float())
    avg_metsmin_workout = fields.List(fields.Float())
    avg_isotonic_workouts = fields.List(fields.Float())
    avg_cardio_workouts = fields.List(fields.Float())