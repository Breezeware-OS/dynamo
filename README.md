# Dynamo Sample Application on Docker

### Prerequisites

Following items are required to build and run the Dynamo Showcase application in a Docker environment.

- Java 17.x
- Maven 3.8.x
- Node 16.0.x
- AWS CLI 2.0.x
- Docker - 20.10.x and above

### Build Container Images

Dynamo Showcase application's Docker environment consists
of 3 containers.

- Dynamo Showcase database - Postgresql
- Dynamo Showcase REST API Server
- Dynamo Showcase webapp

Steps to build the Docker images for these containers are provided below.

### Dynamo Showcase REST API Server Container Image

The container image for the Dynamo Showcase REST API Server is created using the Maven Jib plugin.

<!-- The following command issued from the project's home directory where the pom.xml file is
located will create a Docker image and load it in the local Docker registry. -->

Build and export the CODEARTIFACT_AUTH_TOKEN using the below command.

```bash
export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain breezeware --domain-owner 305251478828 --query authorizationToken --output text`
```

#### Build the dependent projects

```bash
$ cd <project_home>/backend/dynamo-parent-lib
$ mvn -s mvn-settings.xml clean install -Dmaven.test.skip=true

$ cd <project_home>/backend/dynamo-sdk-lib
$ mvn -s mvn-settings.xml clean install -Dmaven.test.skip=true
```

#### Build the REST API server image

```bash
$ cd <project_home>/backend/dynamo-showcase-app
$ mvn clean package jib:dockerBuild -Dmaven.test.skip=true
```

### Build Dynamo Showcase Webapp

```bash
$ cd <project_home>/frontend/dynamo-showcase
```

Run the below command to install dependencies.

```bash
$ npm install -f
```

Build the app using the below command.

```bash
$ npm run build
```

### Run Container Images (Using Docker Compose)

Once the container images are built as per the details in the previous section, they can
be run using Docker Compose (see file `docker-compose.yml`).

```bash
$ cd <project_home>
```

```bash
$ docker compose up
```

### Test Application

Docker Compose will start 3 Docker containers using the images defined
in the docker-compose.yml file. If everything loads up as expected, the Dynamo Showcase application
can be accessed on http://localhost:3000

`Email = siddharth@breezeware.net`

`Password = breeze123`
