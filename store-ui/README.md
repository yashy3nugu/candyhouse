# CandyHouse E-Commerce Frontend

This repository contains the frontend code for the CandyHouse E-Commerce application. The frontend is built with Next.js and is designed to work seamlessly with the accompanying backend services.

## Docker Setup

### Prerequisites

1. Ensure you have [Docker](https://www.docker.com/) installed on your machine.

### Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

#### 2. Build the Docker Image (Development)

```bash
docker build -t candyhouse-frontend:dev -f Dockerfile.dev .
```

#### 3. Set Environment Variables

Create a `.env` file in the root of the project and add the following content:

```env
USER_SERVICE_BASE_URL="http://localhost:7000"
PRODUCT_SERVICE_BASE_URL="http://localhost:4000"
ORDER_SERVICE_BASE_URL="http://localhost:5000"
```

#### 4. Run the Docker Container (Development)

```bash
docker run -p 3000:3000 --env-file .env candyhouse-frontend:dev
```

The development version of the application will be accessible at [http://localhost:3000](http://localhost:3000).

#### 5. Build and Run the Docker Container (Production)

```bash
docker build -t candyhouse-frontend:prod -f Dockerfile.prod .
docker run -p 3000:3000 --env-file .env candyhouse-frontend:prod
```

The production version of the application will be accessible at [http://localhost:3000](http://localhost:3000).

