
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

## Services

This Docker Compose setup includes several services:

1. **app**: The main application running on http://localhost:8080
2. **n8n**: Workflow automation tool accessible at http://localhost:5678
3. **postgres**: PostgreSQL database for n8n on port 5432
4. **supabase**: Supabase PostgreSQL instance on port 5433

## Service Access

- **n8n Dashboard**: http://localhost:5678
- **PostgreSQL**: 
  - Host: localhost
  - Port: 5432
  - User: postgres
  - Password: postgres
  - Database: postgres
- **Supabase PostgreSQL**:
  - Host: localhost
  - Port: 5433
  - User: postgres
  - Password: postgres
  - Database: postgres

## Troubleshooting

If you encounter any issues:

1. Check the logs: `docker-compose logs -f [service-name]`
2. Make sure all required ports are available (8080, 5678, 5432, 5433)
3. Ensure Docker has enough resources allocated

## Production Deployment Considerations

For production environments:

1. Consider using a more specific tagged version of the Node.js image
2. Implement proper health checks
3. Set up a CI/CD pipeline for automated builds
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Implement proper logging and monitoring
6. Change all default passwords and use environment variables
