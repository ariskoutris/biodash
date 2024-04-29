import argparse
import os
import sys

from flask import Flask
from flask_cors import CORS

from ..router.routes import add_routes

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))


def create_app():
    app = Flask(__name__)  # static_url_path, static_folder, template_folder...
    CORS(app, resources={r"/*": {"origins": "*"}})
    add_routes(app)

    @app.route("/version")
    def version():
        return f"Job ID: {os.environ['JOB_ID']}\nCommit ID: {os.environ['COMMIT_ID']}"

    @app.route("/dargons")
    def dargons():
        return f"There be dragons here!"

    return app


def start_server():
    if (
        "DATA_PATH" in os.environ
    ):  # You are in deployment (this variable is crated only in the helm chart, not in the docker)
        print("Deployment environment")
    else:  # You are in local, use local path
        print("Local environment")
        os.environ["DATA_PATH"] = "./data"

    parser = argparse.ArgumentParser()

    # API flag
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="The host to run the server",
    )
    parser.add_argument(
        "--port",
        default=8000,
        help="The port to run the server",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run Flask in debug mode",
    )

    args = parser.parse_args()

    server_app = create_app()

    server_app.run(debug=args.debug, host=args.host, port=args.port)


if __name__ == "__main__":
    if (
        "DATA_PATH" in os.environ
    ):  # You are in deployment (this variable is crated only in the helm chart, not in the docker)
        data_path = os.environ["DATA_PATH"]
    else:  # You are in local, use local path
        print("Local environment")
        os.environ["DATA_PATH"] = "./data"
    #     if not is_dir(data_path):
    #         create_dir(data_path)
    #         download sample data into data_path
    start_server()
