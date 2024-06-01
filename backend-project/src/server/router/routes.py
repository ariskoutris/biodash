from flask_restful import Api

from .. import resources as res

API = "/api/v1/"  # Base API path


def add_routes(app):
    api = Api(app)

    # Resource for posting user data and receiving a unique user ID
    api.add_resource(
        res.forecast_data.PredictionsResource, API + "import", methods=["POST"]
    )

    # Resource for getting line chart data using a user ID, metric, and period
    api.add_resource(
        res.forecast_data.LineChartResource,
        API + "line/<string:user_id>/<int:period>",
        methods=["GET"],
    )

    # Resource for getting feature importance data using a user ID, metric, and period
    api.add_resource(
        res.forecast_data.FeatureImportanceResource,
        API + "features/<string:user_id>/<string:metric>/<int:period>",
        methods=["GET"],
    )
    
    # Resource for getting recommendations using a user ID, metric, target, and period
    api.add_resource(
        res.forecast_data.RecommendationsResource,
        API + "recommendations/<string:user_id>/<string:metric>/<int:target>/<int:period>",
        methods=["GET"],
    )
