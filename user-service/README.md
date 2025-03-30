# User Service API

Microservice responsible for user management in the Candyhouse E-commerce App.

## Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [/register](#register)
  - [/login](#login)
  - [/verify](#verify)

## Development Setup Using Docker

### Prerequisites:
- Ensure Docker is installed and running.
- Create a `.env` file in this directory with the following environment variables:
  - MONGO_URI: MongoDB connection string for user-service.
  - JWT_SECRET: JWT secret for authentication (if applicable).
  - (Optional: NODE_ENV, PORT, and any additional variables as needed.)

### Steps:
1. Build the Docker image:
   ```bash
   docker build -t user-service .
   ```
2. Run the container:
   ```bash
   docker run --env-file .env -p 7000:7000 user-service
   ```
3. Access the service at [http://localhost:7000](http://localhost:7000).

---

## Introduction

This API handles user-related functionalities within the E-commerce application. It supports operations such as user registration, login, and user verification.

## Authentication

The API uses Bearer Token Authentication. Include a valid access token in the Authorization header of your requests.

## Endpoints

### /register

#### `POST /register`

- **Summary:** Register a new user
- **Description:** Register a new user in the system
- **Request Body:**
  - `UserRegistrationInput` schema
- **Responses:**
  - `201`: User registered successfully
    - Example:
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsIn...",
        "user": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "role": "user",
        }
      }
      ```
  - `400`: Bad Request - User with the same email already exists
  - `500`: Internal Server Error

### /login

#### `POST /login`

- **Summary:** User login
- **Description:** Authenticate a user and provide an access token
- **Request Body:**
  - `UserLoginInput` schema
- **Responses:**
  - `201`: User logged in successfully
    - Example:
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsIn...",
        "user": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "role": "user",
        }
      }
      ```
  - `400`: Bad Request - Invalid credentials
  - `500`: Internal Server Error

### /verify

#### `GET /verify`

- **Summary:** Verify user details
- **Description:** Retrieve user details based on the provided JWT token
- **Request Header:**
  - `Authorization`: Bearer Token
- **Responses:**
  - `200`: User details retrieved successfully
    - Example:
      ```json
      {
        "user": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "role": "user",
        }
      }
      ```
  - `401`: Unauthorized - Token not provided or invalid
  - `404`: User not found
  - `500`: Internal Server Error