#!/bin/bash

set -e
CONTAINER_NAME="api-server"
MAX_RETRIES=10
RETRY_DELAY=15
RETRIES=0
RUN_WITH_DB=true

############################################################
# Help                                                     #
############################################################
Help()
{
   # Display Help
   echo "Options used for creation and deletion of docker-compose scripts"
   echo
   echo "Syntax: scriptTemplate [-v|-c|-d]"
   echo "options:"
   echo "-c     Create the compose project by building and deploying the applications."
   echo "-r     Recreate the compose project by removing the existing container, re-building and re-deploying the applications."
   echo "-d     Delete the compose project by detroying containers, volumes, networks and build caches."
   echo "-t     Select Application type of either client, api, or all."
   echo "-h     View the help for defining which options to use."
   echo "Eg:    Command to create all compose services: ./manage-compose.sh -c -t all"
   echo "Eg:    Command to remove compose services: ./manage-compose.sh -d"
   echo "Eg:    Command to rebuild and run compose services: ./manage-compose.sh -r -t api"
   echo
}

############################################################
############################################################
# Main program                                             #
############################################################
############################################################
############################################################
# Process the input options. Add options as needed.        #
############################################################
# Get the options
while getopts ":hcrt:d" option; do
   case $option in
      h) # Display Help
         Help
         exit;;
      c) CREATE=true ;;
      r) RECREATE=true ;;
      t) APPLICATION_TYPE=$OPTARG ;;
      d) DELETE=true ;;
      \?) # Invalid option
         echo "Error: Invalid options"
         exit;;
   esac
done


check_installation(){
  # Check if Java 17 is installed
  if ! java --version 2>&1 | grep -q "openjdk 17."; then
      echo "Java version 17 is not installed."
      exit 1
  fi

  # Check if Docker is installed
  if ! command -v docker &> /dev/null; then
      echo "Docker is not installed."
      exit 1
  fi

  # Check if Docker Compose is installed
  if ! command -v docker compose &> /dev/null; then
      echo "Docker Compose is not installed."
      exit 1
  fi

  # Check if AWS CLI  is installed
  if ! aws --version | grep -q "aws-cli/2."; then
      echo "AWS CLI is not installed."
      exit 1
  else
      # Export CodeArtifact token.
      export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain breezeware --domain-owner 305251478828 --query authorizationToken --output text`
      export DB_CONTEXT_PATH=v1.0.0
  fi

  # Check if Node 16 is installed
  if ! node --version | grep -q "v16."; then
      echo "Node.js v16 is not installed."
      exit 1
  fi

  # Check if npm is installed
  if ! command -v npm &> /dev/null; then
      echo "npm is not installed."
      exit 1
  fi

  # Check if maven is installed
  if ! mvn --version | grep -q "Apache Maven 3."; then
      echo "Apache Maven 3 is not installed."
      exit 1
  fi
  echo "Prerequistes are all Installed"
}

build_api_server(){
  cd backend/dynamo-showcase-app
  # Step 1: Build Library.
  echo "Running Maven build on app-lib..."
  mvn -s mvn-settings.xml clean install -Dmaven.test.skip=true
  # Step 2: Build API Docker image using jib.
  echo "Building Api Service Docker image..."
  mvn jib:dockerBuild
  cd ../../
}

build_web_client(){
  cd frontend/dynamo-showcase
  if [ -d "build" ]; then
    rm -rf build
  fi
  npm install --force
  npm run build
  cd ../../
}

check_health_api(){
  # Loop until the container becomes healthy or the maximum retries are reached
  while [ $RETRIES -lt $MAX_RETRIES ]; do
    echo "Attempt $((RETRIES+1))"
    health_status=$(docker inspect --format='{{json .State.Health.Status}}' "$CONTAINER_NAME")
    if [[ "$health_status" == *"healthy"* ]]; then
      echo "Container is healthy. Exiting..."
      break
    fi
    echo "Waiting for $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
    RETRIES=$((RETRIES+1))
  done
}

setup_all_infra(){
  echo "Starting dev build..."
  # Build API docker image using jib
  echo "Building API Docker image..."
  build_api_server
  # Build Static Contents
  echo "Building Web Client Docker image..."
  build_web_client
  # Start Docker containers
  echo "Starting Docker Compose services..."
  docker compose up --build -d
  echo "Started the compose file"
  # Health check for backend api server
  check_health_api
}

setup_client(){
  echo "Building Web Client Docker image..."
  build_web_client
  # Step 4: Start Docker containers
  echo "Starting Docker Compose services..."
  docker compose up showcase-web --build -d
}

setup_api_server_infra(){
  build_api_server
  # Step 4: Start Docker containers
  echo "Starting Docker Compose services..."
  docker compose up api-server --build -d
  # Health check for backend api server
  check_health_api
}

delete_infra(){
  echo "Stopping all docker compose services and removing all data..."
  docker compose down --volumes --rmi all
  echo "Stopped and removed all resources...."
}

if [ "$CREATE" = true ]; then
  echo "Check the installations"
  check_installation
  if [ -z "$APPLICATION_TYPE" ]; then
    echo "There is no application type mentioned. Use -t for application type. Eg -t client"
    exit 1
  fi
  if [[ "$APPLICATION_TYPE" == "client" ]]; then
    echo "Entering create client server"
    setup_client
    echo "Leaving create client server"
  elif [[ "$APPLICATION_TYPE" == "api" ]]; then
    echo "Entering create api and db server"
    setup_api_server_infra
    echo "Leaving create api and db server"
  elif [[ "$APPLICATION_TYPE" == "all" ]]; then
    echo "Entering create all applications"
    setup_all_infra
    echo "Leaving create all applications"
  else
    echo "Invalid create application type. Please enter client, api, all type only."
  fi
elif [ "$RECREATE" = true ]; then
  echo "Check the installations"
  check_installation
  if [ -z "$APPLICATION_TYPE" ]; then
    echo "There is no application type mentioned. Use -t for application type. Eg -t client"
    exit 1
  fi
  if [[ "$APPLICATION_TYPE" == "client" ]]; then
    echo "Entering recreate client server"
    docker compose down
    setup_client
    echo "Leaving recreate client server"
  elif [[ "$APPLICATION_TYPE" == "api" ]]; then
    echo "Entering recreate api and db server"
    docker compose down
    setup_api_server_infra
    echo "Leaving recreate api and db server"
  elif [[ "$APPLICATION_TYPE" == "all" ]]; then
    echo "Entering recreate all applications"
    docker compose down
    setup_all_infra
    echo "Leaving recreate all applications"
  else
    echo "Invalid recreate application type. Please enter client, api, all type only."
  fi
elif [ "$DELETE" = true ]; then
  echo "Entering Delete compose project"
  delete_infra
  echo "Leaving Delete compose project"
else
  echo "Invalid Compose Options.Must be Create, Delete, Recreate"
fi