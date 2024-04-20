from flask_restful import Api

from .. import resources as res

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.scatter_data.DatasetResource, API + "data/<string:name>")
    # api.add_resource(res.forecast_data.ForecastResource, API + "forecast")
    api.add_resource(
        res.forecast_data.ForecastResource,
        API + "data/radar/<string:id>/<int:duration>",
    )

    return api
