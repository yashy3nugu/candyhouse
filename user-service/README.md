# 👤 CandyHouse User Service API

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [/register](#register)
  - [/login](#login)
  - [/verify](#verify)
- [Swagger Documentation](#swagger-documentation)
- [Event-Driven Architecture](#event-driven-architecture)

## Authentication

The API uses **JWT Bearer Token Authentication** for protected endpoints. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Authentication Requirements:**
- **Public Endpoints**: `/register` (POST), `/login` (POST)
- **Protected Endpoints**: `/verify` (GET) - Requires valid JWT token

## Endpoints

### /register

#### `POST /register`

- **Summary:** Register a new user account
- **Description:** Creates a new user account and publishes user creation event to Kafka. Returns JWT token for immediate authentication.
- **Authentication:** None required
- **Request Body:**
  ```json
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "mypassword123",
    "confirmPassword": "mypassword123",
    "role": "vendor"
  }
  ```
- **Responses:**
  - `201`: User registered successfully
    - Example:
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMSJ9fQ.xyz123",
        "user": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "jane smith",
          "email": "jane.smith@example.com",
          "appId": "user-123-uuid-456",
          "role": "vendor",
          "balance": 0,
          "totalRedeemedCoins": 0,
          "totalEarnedCoins": 0,
          "createdAt": "2023-10-01T10:00:00.000Z",
          "updatedAt": "2023-10-01T10:00:00.000Z"
        }
      }
      ```
  - `400`: Bad Request - User with email already exists or validation error
  - `500`: Internal Server Error

### /login

#### `POST /login`

- **Summary:** User authentication
- **Description:** Authenticates user credentials and returns JWT token for subsequent requests.
- **Authentication:** None required
- **Request Body:**
  ```json
  {
    "email": "jane.smith@example.com",
    "password": "mypassword123"
  }
  ```
- **Responses:**
  - `201`: Login successful
    - Example:
      ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMSJ9fQ.xyz123",
        "user": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "jane smith",
          "email": "jane.smith@example.com",
          "appId": "user-123-uuid-456",
          "role": "vendor",
          "balance": 150.50,
          "totalRedeemedCoins": 25.00,
          "totalEarnedCoins": 175.50,
          "createdAt": "2023-10-01T10:00:00.000Z",
          "updatedAt": "2023-10-01T12:30:00.000Z"
        }
      }
      ```
  - `400`: Bad Request - Invalid credentials
  - `500`: Internal Server Error

### /verify

#### `GET /verify`

- **Summary:** Verify JWT token and get user profile
- **Description:** Validates the provided JWT token and returns the authenticated user's profile information.
- **Authentication:** JWT Bearer Token required
- **Responses:**
  - `200`: Token valid, user profile returned
    - Example:
      ```json
      {
        "user": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "jane smith",
          "email": "jane.smith@example.com",
          "appId": "user-123-uuid-456",
          "role": "vendor",
          "balance": 150.50,
          "totalRedeemedCoins": 25.00,
          "totalEarnedCoins": 175.50,
          "createdAt": "2023-10-01T10:00:00.000Z",
          "updatedAt": "2023-10-01T12:30:00.000Z"
        }
      }
      ```
  - `401`: Unauthorized - Invalid or missing token
  - `404`: User not found
  - `500`: Internal Server Error

## Swagger Documentation

For comprehensive API documentation, refer to the [Swagger Documentation](swagger.yaml) provided in this repository. The Swagger documentation includes:

- **Complete endpoint specifications** with request/response schemas
- **Authentication requirements** for each endpoint
- **Detailed examples** with realistic user data and JWT tokens
- **Error response codes** and descriptions
- **Interactive API testing** capabilities

Access the interactive documentation at: `http://localhost:7000/docs` (when running locally)

## Event-Driven Architecture

### 📡 Kafka Integration

The User Service publishes real-time events to Apache Kafka for seamless integration with other microservices:

#### Published Events

**Topic: `user`**
- **Event**: User registration
- **Consumers**: Product Service, Order Service
- **Payload**: Complete user object with profile information
- **Use Case**: Real-time user profile synchronization across services