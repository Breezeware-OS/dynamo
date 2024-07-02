
# Building and Running a Dynamo Application on Docker

### Prerequisites

The following items are required to build and run the Dynamo application in a Docker environment.

| Component    | Version           |
|--------------|-------------------|
| Java         | 17.x              |
| Maven        | 3.8.x             |
| PostgreSQL   | 12.19             |
| Node         | 16.0.x            |
| AWS CLI      | 2.0.x             |
| Amplify CLI  | 12.x.x            |
| Docker       | 20.10.x and above |

### Build Container Images

The Dynamo application's Docker environment consists of 3 containers:
- Dynamo database
- Dynamo backend
- Dynamo web-ui

Steps to build the Docker images for these containers are provided below.

### Dynamo DB (PostgreSQL) Container Image

The Dockerfile in this directory is used to build a Docker image for PostgreSQL 12.19.

Navigate to the postgres directory:
```bash
cd <project_home>/backend/dynamo-showcase-app/db/postgres
```

Build the Docker image:
```bash
docker build -t dynamo-db .
```

### Dynamo Backend Container Image

The container image for the Dynamo REST API Server is created using the Maven Jib plugin.

Build and export the CODEARTIFACT_AUTH_TOKEN using the command below:
```bash
export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain breezeware --domain-owner 305251478828 --query authorizationToken --output text`
```

#### Build the dependent projects

```bash
cd <project_home>/backend/dynamo-parent-lib
mvn -s mvn-settings.xml clean install -Dmaven.test.skip=true

cd <project_home>/backend/dynamo-sdk-lib
mvn -s mvn-settings.xml clean install -Dmaven.test.skip=true
```

#### Build the REST API server image

```bash
cd <project_home>/backend/dynamo-app
mvn clean package jib:dockerBuild -Dmaven.test.skip=true
```

### Build Dynamo Web UI

Navigate to the frontend directory:
```bash
cd <project_home>/frontend/dynamo-showcase
```

Run the command below to configure Amplify:
```bash
amplify pull
````

Run the command below to install dependencies:
```bash
npm install -f
```

Build the app using the command below:
```bash
npm run build
```

Build the Docker image using the Dockerfile:
```bash
docker build -t dynamo-web-ui .
```

### Run Container Images (Using Docker Compose)

Once the container images are built as per the details in the previous section, they can be run using Docker Compose (see file `docker-compose.yml`).

Navigate to the infra/dev directory:
```bash
cd <project_home>/infra/dev
```

Run Docker Compose:
```bash
docker compose up
```

### Test Application

Docker Compose will start 3 Docker containers using the images defined in the docker-compose.yml file. If everything loads up as expected, the Dynamo web UI can be accessed at [http://localhost:3000](http://localhost:3000).

Default Credentials:
```
Email: siddharth@breezeware.net
Password: breeze123
```

#### Contact
For further assistance, please contact the project maintainers.
Email: `developer@breezeware.net`