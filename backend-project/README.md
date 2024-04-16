# Backend

## Running it without docker container
The backend uses `conda` to create a python virtual environment, and [`poetry`](https://python-poetry.org) for package management and dependency resolution. Make sure you have them both installed locally on your machine.


### Installation
First, you have to create a virtual environment using conda. You can do this by running the following command:

```bash
conda create -n backend-project python=3.10 -y && conda activate backend-project
```

Then, you have to activate the environment:

You can simply install the package through `poetry`:

```bash
poetry install
```


### How to run  
Once the package has been installed, you can run the server by running `python -m src.dummy_server.router.app`.

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
docker images -a
```
If it has more than 1GB you have to implement the external 
storage feature. Please check moodle and the branch of the repository called 
```add-more-storage```

### Running it 
```
docker run -it -p 8000:8000 backend
```

### Development
This project uses `black`, `flake8` and `isort` for code formatting and linting. You can run the following commands to check the code:

```bash
black .
flake8 .
isort .
```
