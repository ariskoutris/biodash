<div align="center">
    <h1>🏃‍♂️ BioDash 🏋️‍♀️</h1>
    <p>
        <a href="#"><img src="https://img.shields.io/badge/Python-3.10-306998" alt="Python 3.10"></a> <a href="#"><img src="https://img.shields.io/badge/Conda-4.12.0-44903d" alt="Conda 4.12.0"></a> <a href="#"><img src="https://img.shields.io/badge/Poetry-1.8.2-5119d4" alt="Poetry 1.8.2"></a>
    </p>
    <a href="http://b13-explaining-athletes-performance.course-xai-iml24.isginf.ch"><strong>🌐 Check out our website »</strong></a>

</div>

## 📊 Overview 

BioDash is an interactive dashboard designed to provide athletes and fitness enthusiasts personalized insights and actionable recommendations based on their unique biometric and exercise data. Using data analytics and machine learning, the dashboard helps users understand their performance, forecast future trends, and achieve specific fitness goals.

Once an athlete logs into the platform, they're greeted with a dashboard displaying:
- their current biometric profile
- their projected biometric profile, given that they maintain the same exercise habits
- toolbar that allows to set quantifiable goals for the future (e.g. weight loss goal)

It highlights the influence of specific training habits and lifestyle factors on their health or recovery, pinpointing areas for potential improvement. The platform allows for real-time adjustments to these factors, showing immediate projected impacts on performance and well-being.

<div align="center">
    <img src="https://imgur.com/AOuFfuI.png" alt="Dashboard Preview" width="800px">
</div>



## 📈 Data

The dataset used in this project is provided by TechnoGym. The data is anonymized and includes information on:
- Training habits
- Various biometrics collected by smartwatches
- Measurements from specialized equipment

These records primarily consist of irregular, sparse time series of biometric measurements and exercise logs gathered over extended periods. We regularized them by matching each user's data points in time, enabling us to analyze how exercise patterns influence biometric changes.


## 🛠️ Setup
### Requirements
For the backend part, you need to have installed `python`, `conda`, and `poetry`, or simply `docker`. You can install them by following the instructions in the links below:
- [Python](https://www.python.org/downloads/)
- [Conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html)
- [Poetry](https://python-poetry.org/docs/)
- [Docker](https://docs.docker.com/get-docker/)

For the front-end, you only need to have installed [npm](https://www.npmjs.com/get-npm) or [Docker](https://docs.docker.com/get-docker/).

### How to Run

- **Backend:**
To set up the backend follow the instructions in the backend [README](backend-project/README.md).

- **Frontend:**
Navigate to the "react-frontend" folder and run:

```bash
npm install
npm start
```

### Development

This project uses `black`, `flake8` and `isort` for code formatting and linting. You can run the following commands to check the code:

```bash
black .
flake8 .
isort .
```

## 👥 Team Members

- Ahmad Khan
- Aristotelis Koutris  
- Maria Gkoulta
- George Manos
