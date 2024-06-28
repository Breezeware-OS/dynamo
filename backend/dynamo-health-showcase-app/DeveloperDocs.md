# Docker Compose Setup Guide

## Step 1: Navigate to API Module

- Navigate to the `backend/dynamo-health-showcase-app/api-lib` module.

## Step 2: Build Maven Packages

- Build Maven packages using the following Maven command:
  ```bash
  mvn clean install
## Step 3: Navigate to API App Module
- Navigate to the `backend/dynamo-health-showcase-app/api-app` module.

## Step 4: Build Docker Image
- Build the Docker image using the following Maven command:
```bash
    mvn clean jib:dockerBuild 
```
## Step 5: Navigate to Project Root
- After creating the image, navigate back to the `backend/dynamo-health-showcase-app` directory.

## Step6: Check the .env.docker-compose.development file 
-Check the configuration file for values. Update the values if necessary.

## Step6: Run Docker Compose
-Run the following Docker Compose command to start the Docker images:
```bash
docker compose up -d
```

