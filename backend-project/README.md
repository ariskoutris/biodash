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
docker build . -t backend 
```
### Checking that it has the right size
```
docker ps -a
```
If it has more than 1GB you have to implement the external 
storage feature. Please check moodle and the branch of the repository called 
```add-more-storage```

### Running it 
```
docker run -it -p 8000:8000 backend
```
