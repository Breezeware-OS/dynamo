# Quickstart Guide for Dynamo Services

This guide will help you get started with setting up and running the Dynamo services using Docker Compose.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Setup

### Step 1: Clone the Repository

Clone the repository containing the Docker Compose file to your local machine.

```bash
git clone <repository_url>
cd <repository_directory>/infra/quick-start
```

### Step 2: Environment Variables
Make sure you have the environment variables set up correctly. 
Create a `.env` file in the dev directory if it doesn't exist, and populate it with the necessary environment variables. 

You can use `quick-start/.env` as a reference.

### Step 3: Start the Services
Run the following command to start all services:

```bash
docker-compose up
```
This will start the following services:

- dynamo-backend: Available at http://localhost:8080
- dynamo-db: Available at http://localhost:5432
- dynamo-web-ui: Available at http://localhost:3000

### Step 4: Verify the Setup
Check the logs to ensure all services are running correctly. You can access the logs using:

```bash
docker-compose logs -f
```

### Stopping the Services
To stop all services, use the following command:

```bash
docker-compose down
```

#### Contact
For further assistance, please contact the project maintainers.
Email: `developer@breezeware.net`