
<div align="center">
    <header><h1>Explaining Athletes Performance</h1></header>
    <a href="#">
    <img src="https://img.shields.io/badge/Python-3.10-306998">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/Conda-4.12.0-44903d">
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/Poetry-1.8.2-5119d4">
    </a>
    <br>
    <a href="http://b13-explaining-athletes-performance.course-xai-iml24.isginf.ch"><strong>Check out our website »</strong></a>
</div>
<br>

## Team Members
1. Ahmad Khan
2. Aristotelis Koutris
3. Georgios Manos
4. Maria Gkoulta

## Project Description 
The project aims to design an interactive system that adapts to each athlete's unique circumstances, including preferences and limitations. Whether it's adjusting for an injury or tailoring training needs, our technology is equipped to pivot, providing a truly personalized training journey. Our application delves into analyzing anonymized training data, which could be in time-series or tabular form, to unveil the patterns that lead to success. This could include things like body characteristics, training time, training frequency, heart rate or sleep duration. 

Once an athlete logs into the platform, they're greeted with a dashboard displaying their performance history, biometrics, and the evolution of their body characteristics. It highlights the influence of specific training habits and lifestyle factors on their health or recovery, pinpointing areas for potential improvement. The platform allows for real-time adjustments to these factors, showing immediate projected impacts on performance and well-being. 

### Users
The target users of our project are athletes as well as people who work out casually, who are looking to improve specific aspects of their performance. The platform is designed to be user-friendly and accessible to all, regardless of their technical background.

### Datasets
The dataset used in this project is provided by our partners at TechnoGym. The data is anonymized and includes information on training habits and various biometrics collected by smartwatches and special equipment. The raw data are stored in excel files, from which we extract the information our model needs and collect everything in a .csv file, which can be found in the folder [data](backend-project/data).

### Tasks
The dashboard aims to solve the following tasks:
1. **Performance Analysis**: The platform provides a detailed analysis of the athlete's performance, highlighting the influence of specific training habits and lifestyle factors on their health or recovery.
2. **Personalized Recommendation**: The user will be able to select a specific goal, and the platform will provide personalized recommendations on how to achieve it by adjusting their training habits.

- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
.
├── backend-project
│         ├── src
│         │         ├── __pycache__
│         │         │         └── __init__.cpython-310.pyc
│         │         ├── server
│         │         │         ├── models
│         │         │         │         ├── biometrics_prediction.py
│         │         │         │         └── model.py
│         │         │         ├── resources
│         │         │         │         ├── users
│         │         │         │         │         └── dummy.json
│         │         │         │         ├── __init__.py
│         │         │         │         └── forecast_data.py
│         │         │         ├── router
│         │         │         │         ├── __init__.py
│         │         │         │         ├── app.py
│         │         │         │         └── routes.py
│         │         │         ├── schemas
│         │         │         │         ├── __init__.py
│         │         │         │         ├── biometric_data.py
│         │         │         │         ├── exercise.py
│         │         │         │         ├── recommendations.py
│         │         │         │         └── user.py
│         │         │         ├── weights
│         │         │         │         ├── Fat mass Perc
│         │         │         │         │         ├── model.pkl
│         │         │         │         │         ├── past_cov.pkl
│         │         │         │         │         ├── preprocessor.pkl
│         │         │         │         │         ├── scaler.pkl
│         │         │         │         │         └── target.pkl
│         │         │         │         ├── HR At Rest
│         │         │         │         │         ├── model.pkl
│         │         │         │         │         ├── past_cov.pkl
│         │         │         │         │         ├── preprocessor.pkl
│         │         │         │         │         ├── scaler.pkl
│         │         │         │         │         └── target.pkl
│         │         │         │         ├── Muscle Mass
│         │         │         │         │         ├── model.pkl
│         │         │         │         │         ├── past_cov.pkl
│         │         │         │         │         ├── preprocessor.pkl
│         │         │         │         │         ├── scaler.pkl
│         │         │         │         │         └── target.pkl
│         │         │         │         └── Weight
│         │         │         │             ├── model.pkl
│         │         │         │             ├── past_cov.pkl
│         │         │         │             ├── preprocessor.pkl
│         │         │         │             ├── scaler.pkl
│         │         │         │             └── target.pkl
│         │         │         └── __init__.py
│         │         └── __init__.py
│         ├── Dockerfile
│         ├── MANIFEST.in
│         ├── README.md
│         ├── __init__.py
│         ├── poetry.lock
│         └── pyproject.toml
├── forecasting-model
│         ├── data
│         │         ├── BM_2022_Q1_Q2.csv
│         │         ├── BM_2022_Q3_Q4.csv
│         │         ├── BioMeasurementSampleDataset.xlsx
│         │         ├── BioMeasurementTimeseriesSampleDataset.xlsx
│         │         ├── Legend.xlsx
│         │         ├── PerformedExercisesSampleDataset.xlsx
│         │         ├── bq-results-20240418-170114-1713459684969.csv
│         │         ├── bq-results-20240418-170723-1713460063623.csv
│         │         ├── exercise_df.pkl
│         │         ├── exercise_muscle_df.pkl
│         │         └── user_data_dummy.json
│         ├── weights
│         │         ├── Fat mass Perc
│         │         │         ├── model.pkl
│         │         │         ├── past_cov.pkl
│         │         │         ├── preprocessor.pkl
│         │         │         ├── scaler.pkl
│         │         │         └── target.pkl
│         │         ├── HR At Rest
│         │         │         ├── model.pkl
│         │         │         ├── past_cov.pkl
│         │         │         ├── preprocessor.pkl
│         │         │         ├── scaler.pkl
│         │         │         └── target.pkl
│         │         ├── Muscle Mass
│         │         │         ├── model.pkl
│         │         │         ├── past_cov.pkl
│         │         │         ├── preprocessor.pkl
│         │         │         ├── scaler.pkl
│         │         │         └── target.pkl
│         │         └── Weight
│         │             ├── model.pkl
│         │             ├── past_cov.pkl
│         │             ├── preprocessor.pkl
│         │             ├── scaler.pkl
│         │             └── target.pkl
│         ├── data_preprocessing.ipynb
│         ├── model_explainability.ipynb
│         ├── model_training.ipynb
│         ├── processed_dataset.pkl
│         └── timeseries_dataset.pkl
├── helm
│         ├── charts
│         ├── files
│         ├── templates
│         │         ├── deployment.yaml
│         │         ├── ingress.yaml
│         │         └── service.yaml
│         ├── Chart.yaml
│         └── values.yaml
├── react-frontend
│         ├── public
│         │         ├── favicon.ico
│         │         ├── index.html
│         │         ├── logo192.png
│         │         ├── logo512.png
│         │         ├── manifest.json
│         │         └── robots.txt
│         ├── src
│         │         ├── assets
│         │         │         └── technogym_logo_vector.png
│         │         ├── components
│         │         │         ├── plotContainer
│         │         │         │         ├── ForecastPlot.jsx
│         │         │         │         ├── HorizontalBarPlot.jsx
│         │         │         │         ├── RadarChart.jsx
│         │         │         │         ├── plotContainer.jsx
│         │         │         │         └── plotContainer.scss
│         │         │         ├── InteractionsContainer.jsx
│         │         │         └── InteractionsContainer.scss
│         │         ├── pages
│         │         │         └── mainPage
│         │         │             └── mainPage.jsx
│         │         ├── router
│         │         │         ├── resources
│         │         │         │         └── data.ts
│         │         │         └── apiClient.ts
│         │         ├── types
│         │         │         ├── charts.ts
│         │         │         └── recommendations.ts
│         │         ├── App.scss
│         │         ├── App.test.tsx
│         │         ├── App.tsx
│         │         ├── _custom-bootstrap.scss
│         │         ├── colors.module.scss
│         │         ├── defaults.ts
│         │         ├── index.scss
│         │         ├── index.tsx
│         │         ├── logo.svg
│         │         ├── react-app-env.d.ts
│         │         ├── reportWebVitals.ts
│         │         ├── setupTests.ts
│         │         └── utils.ts
│         ├── Dockerfile
│         ├── Dockerfile_local
│         ├── README.md
│         ├── package-lock.json
│         ├── package.json
│         └── tsconfig.json
├── README.md
└── output.txt

```

## Requirements
For the backend part, you need to have installed `python`, `conda`, and `poetry`, or simply `docker`. You can install them by following the instructions in the links below:
- [Python](https://www.python.org/downloads/)
- [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html)
- [Poetry](https://python-poetry.org/docs/)
- [Docker](https://docs.docker.com/get-docker/)

For the front-end, you only need to have installed [NPM](https://www.npmjs.com/get-npm) or [Docker](https://docs.docker.com/get-docker/).

## How to Run
To run the project you have to:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;

To run the backend
- Check [backend readme](backend-project/README.md) for detailed instructions.

To run the frontend
- Open a new terminal window and go to the project folder
- Enter the frontend folder called "react-frontend"
- Do the following command to start the front end ```npm install```, ```npm start```
If all the steps have been successfully executed a new browser window witht he dummy project loaded will open automatically.

## Milestones and Weekly Summary
Milestones can be found in detail in our [project board](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/boards).

## Contribution Statement
Members contribution:
- Ahmad Khan: Worked on the frontend part of the project, including the hooks, dashboard interactivity and plot styling. Also built the backend endpoints structure.
- Aristotelis Koutris: Handled the machine learning model training, predictions, feature importance and recommendations. Also integrated those components on the frontend and worked on front-end styling.
- Maria Gkoulta: Worked on the data preprocessing, cleaning and feature extraction, front-end styling and design. Also worked on composing the report and making the poster.
- George Manos: Handled project build, deployment and front-end dashboard structure. Also worked on front-end structure, plots and model integration to the frontend.

Also note that all members contributed to the front-end design options to improve the application's story-telling.