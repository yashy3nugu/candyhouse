# Order Service API

Microservice used for processing of orders in the candy house API

## Table of Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [/order](#order)
  - [/order/user](#orderuser)
  - [/order/{id}](#orderid)
  - [/order/{id}/cancel](#orderidcancel)
  - [/bank](#bank)

## Development Setup Using Docker

**Prerequisites:**
- Docker must be installed and running.
- Create a `.env` file in this directory with the following environment variables:
  - MONGO_URI: MongoDB connection string for order-service.
  - PAYMENT_GATEWAY_KEY: Payment gateway secret.
  - REDIS_PASSWORD: Redis password.
  - (Add additional secrets if necessary.)

**Steps:**
1. Build the Docker image:
   ```bash
   docker build -t order-service .
   ```
2. Run the container:
   ```bash
   docker run --env-file .env -p 7000:7000 order-service
   ```
3. Verify the service is running by accessing [http://localhost:7000](http://localhost:7000).

## Introduction

This API provides functionalities related to managing orders within the E-commerce application. It supports operations such as retrieving paginated orders, creating new orders, updating order details, and more.

## Authentication

The API uses Bearer Token Authentication. Include a valid access token in the Authorization header of your requests.

## Endpoints

### /order

#### `GET /order`

- **Summary:** Get paginated orders (Admin)
- **Description:** Get paginated orders for admin users
- **Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Number of items per page
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "hasMore": false,
        "orders": [
          {
            "_id": "order_id",
            "user": "user_id",
            "items": [
              {
                "candy": "candy_id",
                "itemsInCart": 2,
                "price": 10.0
              }
            ],
            "price": 20.0,
            "address": "Shipping Address",
            "bank": "Bank Name",
            "coinsRedeemed": 0,
            "status": "Processing"
          }
          // Additional orders...
        ]
      }
      ```

#### `POST /order`

- **Summary:** Create a new order (User)
- **Description:** Create a new order for a user
- **Request Body:**
  - `OrderInput` schema
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "6fc02cb7f068b18fad8a65a7",
        "user": "5fc02cb7f068b18fad8a65a7",
        "items": [
          {
            "candy": "candy_id",
            "itemsInCart": 2,
            "price": 10.0
          }
        ],
        "price": 20.0,
        "address": "Shipping Address",
        "bank": "Bank Name",
        "coinsRedeemed": 0,
        "status": "Processing"
      }
      ```
  - `400`: Bad Request
  - `401`: Unauthorized
  - `500`: Internal Server Error

### /order/user

#### `GET /order/user`

- **Summary:** Get paginated orders for a user
- **Description:** Get paginated orders for a specific user
- **Parameters:**
  - `page` (optional): Page number
  - `limit` (optional): Number of items per page
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "hasMore": false,
        "orders": [
          {
            "_id": "6fc02cb7f068b18fad8a65a7",
            "user": "5fc02cb7f068b18fad8a65a7",
            "items": [
              {
                "candy": "candy_id",
                "itemsInCart": 2,
                "price": 10.0
              }
            ],
            "price": 20.0,
            "address": "Shipping Address",
            "bank": "Bank Name",
            "coinsRedeemed": 0,
            "status": "Processing"
          }
          // Additional orders...
        ]
      }
      ```
  - `401`: Unauthorized

### /order/{id}

#### `GET /order/{id}`

- **Summary:** Get order by ID (User/Admin)
- **Description:** Get details of a specific order by ID
- **Parameters:**
  - `id` (path): Order ID
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "5fc02cb7f068b18fad8a65a7",
        "user": "6fc02cb7f068b18fad8a65a7",
        "items": [
          {
            "candy": "7fc02cb7f068b18fad8a65a7",
            "itemsInCart": 2,
            "price": 10.0
          }
        ],
        "price": 20.0,
        "address": "Shipping Address",
        "bank": "Bank Name",
        "coinsRedeemed": 0,
        "status": "Processing"
      }
      ```
  - `404`: Order not found
  - `401`: Unauthorized

#### `POST /order/{id}/cancel`

- **Summary:** Cancel order by ID (User)
- **Description:** Cancel a specific order by ID
- **Parameters:**
  - `id` (path): Order ID
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "5fc02cb7f068b18fad8a65a7",
        "user": "6fc02cb7f068b18fad8a65a7",
        "items": [
          {
            "candy": "7fc02cb7f068b18fad8a65a7",
            "itemsInCart": 2,
            "price": 10.0
          }
        ],
        "price": 20.0,
        "address": "Shipping Address",
        "bank": "Bank Name",
        "coinsRedeemed": 0,
        "status": "Cancelled"
      }
      ```
  - `400`: Bad Request
  - `401`: Unauthorized
  - `404`: Order not found
  - `500`: Internal Server Error

#### `PATCH /order/{id}`

- **Summary:** Update order by ID (Any)
- **Description:** Update details of a specific order by ID
- **Parameters:**
  - `id` (path): Order ID
- **Request Body:**
  - `OrderUpdate` schema
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "5fc02cb7f068b18fad8a65a7",
        "user": "6fc02cb7f068b18fad8a65a7",
        "items": [
          {
            "candy": "8fc02cb7f068b18fad8a65a7",
            "itemsInCart": 2,
            "price": 10.0


          }
        ],
        "price": 20.0,
        "address": "Updated Shipping Address",
        "bank": "Updated Bank Name",
        "coinsRedeemed": 0,
        "status": "Processing"
      }
      ```
  - `400`: Bad Request
  - `401`: Unauthorized
  - `404`: Order not found

### /order/{id}/cancel

#### `PATCH /order/{id}/cancel`

- **Summary:** Cancel an order
- **Description:** Marks the status of the order document as "cancelled". Only the status field can be modified in this operation.
- **Parameters:**
  - `id` (path): Order ID
- **Request Body:**
  - Example:
    ```json
    {
      "status": "cancelled"
    }
    ```
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "order_id",
        "user": "user_id",
        "items": [
          {
            "candy": "candy_id",
            "itemsInCart": 2,
            "price": 10.0
          }
        ],
        "price": 20.0,
        "address": "Shipping Address",
        "bank": "Bank Name",
        "coinsRedeemed": 0,
        "status": "cancelled"
      }
      ```
  - `400`: Bad Request
  - `401`: Unauthorized
  - `404`: Order not found
  - `500`: Internal Server Error

### /bank

#### `GET /bank`

- **Summary:** Get all banks
- **Description:** Get a list of all banks
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "banks": [
          {
            "_id": "5fc02cb7f068b18fad8a65a7",
            "name": "SBI"
          }
          // Additional banks...
        ]
      }
      ```
  - `401`: Unauthorized
