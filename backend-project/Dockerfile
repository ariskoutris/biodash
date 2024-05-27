# Use a Python 3.10 slim image
FROM python:3.10-slim


# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        g++ \
        git \
    && apt-get -y autoremove \
    && apt-get clean \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /srv/backend-app

# Copy only pyproject.toml and poetry.lock (if available) to cache dependencies
COPY README.md requirements.txt /srv/backend-app/

# Disable creation of a virtual environment as the container itself is isolated
RUN pip install -r requirements.txt

# Copy the rest of your application code
COPY . /srv/backend-app

# Command to run your application
CMD ["python", "-m", "src.server.router.app", "--host", "0.0.0.0"]
