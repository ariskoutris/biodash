# Dummy Backend

## Running it without docker container
### Installation
You can simply install the package through [pip](https://pypi.org/project/pip/):

```
cd backend-project
pip install .
```

If you want to make changes and test them in real time, you can install the package in editable mode (`-e`):

```
pip install -e .
```

### How to run  
Once the package has been installed, you can run the server by running the `start-server` command directly on your terminal, or by running `python -m dummy_server.router.app`.

## Running it with docker container locally
**This step is mandatory before running the CI/CD pipeline in Gitlab (it will save you
a lot of time debugging)**
### Building
Simply build the image with 
```
DOCKER_BUILDKIT=1 docker build -t backend -f Dockerfile_local . 
```
You use the flag ```DOCKER_BUILDKIT=1``` so the Dockerfile_local get the corresponding
.dockerignore (that does not ignore the data folder)

### Running it 
```
docker run -it -p 8000:8000 backend
```

Please note that when commited to the Release branch, the CD/CI
pipeline of Gitlab will use Dockerfile (associated with .dockerignore) and
not Dockerfile_local (associated with Dockerfile_local.dockerignore)
