# Explaining Athletes Performance

[[_TOC_]]

## Team Members
1. Ahmad Khan
2. Aristotelis Koutris
3. Georgios Manos
4. Maria Gkoulta

## Project Description 
The project aims to design an interactive system that adapts to each athlete's unique circumstances, including preferences and limitations. Whether it's adjusting for an injury or tailoring training needs, our technology is equipped to pivot, providing a truly personalized training journey. Our application delves into analyzing anonymized training data, which could be in time-series or tabular form, to unveil the patterns that lead to success. This could include things like body characteristics, training time, training frequency, heart rate or sleep duration. 

Once an athlete logs into the platform, they're greeted with a dashboard displaying their performance history, biometrics, and the evolution of their body characteristics. It highlights the influence of specific training habits and lifestyle factors on their health or recovery, pinpointing areas for potential improvement. The platform allows for real-time adjustments to these factors, showing immediate projected impacts on performance and well-being. 

### Users
The target users of our project are athletes, from beginners to intermediate levels, who are looking to improve specific aspects of their performance. The platform is designed to be user-friendly and accessible to all, regardless of their technical background.

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
├── README.md  
├── backend-project
│   ├── setup.py   # main app
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── MANIFEST.in
│   ├── README.md
│   ├── pyproject.toml
│   ├── data
│   │   ├── ames-housing-features.json
│   │   ├── ames-housing-gam-instance-data.json
│   │   └── ames-housing-gam.json
│   └── src/gamut_server
│       ├── resources
│       │   ├── __init__.py
│       │   ├── description.py
│       │   ├── features.py
│       │   └── instances.py
│       ├── router
│       │   ├── __init__.py
│       │   ├── app.py
│       │   └── routes.py
│       └── __init__.py
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── backend
│   │   │   ├── BackendQueryEngine.tsx
│   │   │   └── json-decoder.ts
│   │   ├── components
│   │   │   ├── BasicLineChart
│   │   │   │   ├── BasicLineChart.scss
│   │   │   │   ├── BasicLineChart.tsx
│   │   │   │   └── types.ts
│   │   │   ├── DataChoiceComponent.tsx
│   │   │   ├── DataPointComponent.tsx
│   │   │   └── ScatterPlot
│   │   │       ├── ScatterPlot.scss
│   │   │       ├── ScatterPlot.tsx
│   │   │       └── types.ts
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── DataArray.ts
│   │       ├── DataPoint.ts
│   │       └── Margins.ts
│   └── tsconfig.json
└── requirements.txt
```

## Requirements
Write here all intructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the Dummy project you have to:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;

To run the backend
- open the backend folder called "backend-project"
- to start the backend first you need to create a virtual environment using conda
    ```conda create -n nameOfTheEnvironment```
  - to activate the virtual environment run the command ```conda activate nameOfTheEnvironment```
  - install the requirements using the command ```pip3 install .```
  - If you want to make changes and test them in real time, you can install the package in editable mode using the command```pip install -e .```
  - to start the backend use the command ```python3 -m gamut_server.router.app``` or use the ```start-server``` command directly on your terminal

To run the frontend
- Open a new terminal window and go to the project folder
- Enter the frontend folder called "react-frontend"
- Do the following command to start the front end ```npm install```, ```npm start```
If all the steps have been successfully executed a new browser window witht he dummy project loaded will open automatically.

## Milestones
Document here the major milestones of your code and future planned steps.
- [x] Week 1
  - Create [pitch video](https://drive.google.com/file/d/1nu63RrAuE41CabnPYvGRDopRi_KDacI7/view).

- [ ] Week 2
  - [ ] [Frontend Sketch: #1](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/issues/1)
  - [ ] [Data Preprocessing: #2](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/issues/2)
  - [ ] [Model: #3](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/issues/3)
  - [ ] [Endpoints: #4](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/issues/4)

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags.\
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/course-xai-iml24/b13-explaining-athletes-performance/-/tags/v0.1.0)
- Week 2: ..
- Week 3: ..
- ...


