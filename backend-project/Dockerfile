# Use a Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables to non-interactive (this avoids some warnings and errors during installation)
ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.8.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_NO_INTERACTION=1

# Add Poetry to the PATH
ENV PATH="$POETRY_HOME/bin:$PATH"

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        g++ \
        git \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get remove -y curl \
    && apt-get -y autoremove \
    && apt-get clean \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /srv/backend-app

# Copy only pyproject.toml and poetry.lock (if available) to cache dependencies
COPY README.md pyproject.toml poetry.lock* /srv/backend-app/

# Disable creation of a virtual environment as the container itself is isolated
RUN poetry config virtualenvs.create false

# Copy the rest of your application code
COPY . /srv/backend-app

# Install runtime dependencies using Poetry
RUN poetry install --only main --no-cache

# Command to run your application
CMD ["python", "-m", "src.server.router.app", "--host", "0.0.0.0"]
