
# Docker Setup for BIOKING

This document explains how to run the BIOKING application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Running with Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:8080`.

## Building and Running with Docker

If you prefer to use Docker directly:

```bash
# Build the Docker image
docker build -t bioking-app .

# Run the container
docker run -p 8080:80 -d bioking-app
```

The application will be available at `http://localhost:8080`.

## Production Deployment Considerations

For production environments:

1. Consider using a more specific tagged version of the Node.js image
2. Implement proper health checks
3. Set up a CI/CD pipeline for automated builds
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Implement proper logging and monitoring
