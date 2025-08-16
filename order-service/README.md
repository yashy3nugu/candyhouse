# 📦 CandyHouse Order Service API

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [/order](#order)
  - [/order/confirm](#orderconfirm)
  - [/order/user](#orderuser)
  - [/order/{id}](#orderid)
  - [/order/{id}/cancel](#orderidcancel)
  - [/webhooks/stripe](#webhooksstripe)
  - [/bank](#bank)
- [Swagger Documentation](#swagger-documentation)
- [Payment Processing Flow](#payment-processing-flow)
- [Event-Driven Architecture](#event-driven-architecture)

## Authentication

The API uses **JWT Bearer Token Authentication** obtained from the User Service. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Authentication Requirements:**
- **Public Endpoints**: `/bank` (GET)
- **User Endpoints**: `/order` (POST), `/order/confirm` (POST), `/order/user` (GET), `/order/{id}` (GET), `/order/{id}/cancel` (PATCH)
- **Admin Endpoints**: `/order` (GET), `/order/{id}` (PATCH)
- **System Endpoints**: `/webhooks/stripe` (POST) - No authentication required

## Endpoints

### /order

#### `GET /order`

- **Summary:** Get paginated orders for admin users
- **Description:** Retrieves all orders in the system with pagination. Requires admin authentication for system-wide order management.
- **Authentication:** Admin JWT required
- **Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 6)
- **Responses:**
  - `200`: Paginated list of all orders
    - Example:
      ```json
      {
        "hasMore": true,
        "orders": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
            "user": "64f1a2b3c4d5e6f7g8h9i0j2",
            "status": "pending",
            "items": [
              {
                "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
                "name": "chocolate bar",
                "price": 2.99,
                "quantity": 50,
                "description": "Dark chocolate",
                "itemsInCart": 2,
                "photo": {
                  "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg"
                }
              }
            ],
            "address": "123 Main St, City, State 12345",
            "price": 5.98,
            "coinsRedeemed": 0,
            "createdAt": "2023-10-01T10:00:00.000Z",
            "updatedAt": "2023-10-01T10:00:00.000Z"
          }
        ]
      }
      ```
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User is not an admin

#### `POST /order`

- **Summary:** Create Stripe PaymentIntent for order
- **Description:** Creates a Stripe PaymentIntent for order payment. This creates a reservation and returns client secret for frontend payment processing.
- **Authentication:** User JWT required
- **Request Body:**
  ```json
  {
    "items": [
      {
        "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "chocolate bar",
        "price": 2.99,
        "quantity": 50,
        "description": "Dark chocolate bar",
        "itemsInCart": 2,
        "photo": {
          "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg"
        }
      }
    ],
    "address": "123 Main St, City, State 12345"
  }
  ```
- **Responses:**
  - `200`: PaymentIntent created successfully
    - Example:
      ```json
      {
        "clientSecret": "pi_1234567890abcdef_secret_xyz"
      }
      ```
  - `400`: Bad Request - Invalid order data
  - `401`: Unauthorized - Invalid or missing JWT token
  - `500`: Internal Server Error

### /order/confirm

#### `POST /order/confirm`

- **Summary:** Confirm order after successful payment
- **Description:** Confirms order creation after successful Stripe payment. Validates inventory, creates final order, and publishes Kafka events.
- **Authentication:** User JWT required
- **Request Body:**
  ```json
  {
    "paymentIntentId": "pi_1234567890abcdef",
    "items": [
      {
        "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "chocolate bar",
        "price": 2.99,
        "quantity": 50,
        "description": "Dark chocolate bar",
        "itemsInCart": 2,
        "photo": {
          "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg"
        }
      }
    ],
    "address": "123 Main St, City, State 12345"
  }
  ```
- **Responses:**
  - `200`: Order confirmed and created successfully
  - `400`: Bad Request - Payment not confirmed or insufficient inventory
  - `401`: Unauthorized - Invalid or missing JWT token
  - `500`: Internal Server Error

### /order/user

#### `GET /order/user`

- **Summary:** Get paginated orders for authenticated user
- **Description:** Retrieves all orders belonging to the authenticated user with pagination. User can only see their own orders.
- **Authentication:** User JWT required
- **Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 6)
- **Responses:**
  - `200`: Paginated list of user's orders
    - Example:
      ```json
      {
        "hasMore": false,
        "orders": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
            "user": "64f1a2b3c4d5e6f7g8h9i0j2",
            "status": "delivered",
            "items": [
              {
                "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
                "name": "gummy bears",
                "price": 1.99,
                "quantity": 100,
                "description": "Fruit-flavored gummies",
                "itemsInCart": 3,
                "photo": {
                  "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/gummy.jpg"
                }
              }
            ],
            "address": "456 Oak Ave, Town, State 67890",
            "price": 5.97,
            "coinsRedeemed": 0,
            "createdAt": "2023-09-28T14:30:00.000Z",
            "updatedAt": "2023-09-30T16:45:00.000Z"
          }
        ]
      }
      ```
  - `401`: Unauthorized - Invalid or missing JWT token

### /order/{id}

#### `GET /order/{id}`

- **Summary:** Get order details by ID
- **Description:** Retrieves detailed information about a specific order. Users can only access their own orders, admins can access any order.
- **Authentication:** User/Admin JWT required
- **Parameters:**
  - `id` (path): MongoDB ObjectId of the order
- **Responses:**
  - `200`: Order details retrieved successfully
    - Example:
      ```json
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "user": "64f1a2b3c4d5e6f7g8h9i0j2",
        "status": "pending",
        "items": [
          {
            "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
            "name": "chocolate bar",
            "price": 2.99,
            "quantity": 50,
            "description": "Dark chocolate",
            "itemsInCart": 2,
            "photo": {
              "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg"
            }
          }
        ],
        "address": "123 Main St, City, State 12345",
        "price": 5.98,
        "coinsRedeemed": 0,
        "createdAt": "2023-10-01T10:00:00.000Z",
        "updatedAt": "2023-10-01T10:00:00.000Z"
      }
      ```
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User cannot access this order
  - `404`: Order not found

#### `PATCH /order/{id}`

- **Summary:** Update order (Admin only)
- **Description:** Updates order details. Only admins can modify orders. Supports partial updates of items, address, bank, and status.
- **Authentication:** Admin JWT required
- **Parameters:**
  - `id` (path): MongoDB ObjectId of the order
- **Request Body:**
  ```json
  {
    "status": "delivered",
    "address": "Updated: 789 Pine St, Village, State 11111"
  }
  ```
- **Responses:**
  - `200`: Order updated successfully
  - `400`: Bad Request - Invalid update data
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User is not an admin
  - `404`: Order not found

### /order/{id}/cancel

#### `PATCH /order/{id}/cancel`

- **Summary:** Cancel order (User only)
- **Description:** Allows users to cancel their own orders by setting status to 'cancelled'. Users can only cancel their own orders.
- **Authentication:** User JWT required
- **Parameters:**
  - `id` (path): MongoDB ObjectId of the order to cancel
- **Responses:**
  - `200`: Order cancelled successfully
    - Example:
      ```json
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "user": "64f1a2b3c4d5e6f7g8h9i0j2",
        "status": "cancelled",
        "items": [
          {
            "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
            "name": "chocolate bar",
            "price": 2.99,
            "quantity": 50,
            "description": "Dark chocolate",
            "itemsInCart": 2,
            "photo": {
              "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg"
            }
          }
        ],
        "address": "123 Main St, City, State 12345",
        "price": 5.98,
        "coinsRedeemed": 0,
        "createdAt": "2023-10-01T10:00:00.000Z",
        "updatedAt": "2023-10-01T12:30:00.000Z"
      }
      ```
  - `400`: Bad Request - Order cannot be cancelled
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User cannot cancel this order
  - `404`: Order not found

### /webhooks/stripe

#### `POST /webhooks/stripe`

- **Summary:** Stripe webhook handler
- **Description:** Handles Stripe webhook events, particularly payment_intent.succeeded for automatic order processing with inventory validation and refund capability.
- **Authentication:** No authentication required (Stripe signature validation)
- **Request Body:** Stripe webhook event payload
- **Responses:**
  - `200`: Webhook processed successfully
  - `400`: Invalid webhook signature or payload

### /bank

#### `GET /bank`

- **Summary:** Get all available banks
- **Description:** Retrieves a list of all banks available for payment processing. Used for order payment method selection.
- **Authentication:** User JWT required
- **Responses:**
  - `200`: List of available banks
    - Example:
      ```json
      {
        "banks": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
            "name": "SBI"
          },
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
            "name": "HDFC Bank"
          },
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
            "name": "ICICI Bank"
          }
        ]
      }
      ```
  - `401`: Unauthorized - Invalid or missing JWT token

## Swagger Documentation

For comprehensive API documentation, refer to the [Swagger Documentation](swagger.yaml) provided in this repository. The Swagger documentation includes:

- **Complete endpoint specifications** with request/response schemas
- **Authentication requirements** for each endpoint
- **Detailed examples** with realistic payment and order data
- **Error response codes** and descriptions
- **Interactive API testing** capabilities

Access the interactive documentation at: `http://localhost:5000/docs` (when running locally)

## Payment Processing Flow

The Order Service implements a **secure two-phase payment flow** using Stripe:

### 🎯 Payment Flow

1. **Payment Intent Creation**: `/order` (POST) creates Stripe PaymentIntent and inventory reservation
2. **Frontend Payment**: User completes payment using Stripe.js with client secret
3. **Order Confirmation**: `/order/confirm` (POST) validates payment and creates final order
4. **Webhook Processing**: Stripe webhook handles automatic order processing for successful payments

### 🔒 Security Features

- **Inventory Reservation**: Temporary holds prevent overselling during payment
- **Payment Validation**: PaymentIntent status verified before order creation
- **Idempotent Processing**: Duplicate webhook events handled gracefully
- **Automatic Refunds**: Failed inventory validation triggers immediate refunds

### 💳 Stripe Integration

- **PaymentIntent API**: Secure payment processing with SCA compliance
- **Webhook Events**: `payment_intent.succeeded` for automatic order processing
- **Error Handling**: Comprehensive error responses for payment failures
- **Refund Capability**: Automatic refunds for inventory validation failures

## Event-Driven Architecture

### 📡 Kafka Integration

The Order Service publishes real-time events to Apache Kafka for seamless integration with other microservices:

#### Published Events

**Topic: `order`**
- **Event**: Order creation/updates/cancellations
- **Consumers**: Product Service, User Service
- **Payload**: Complete order object with items and status
- **Use Case**: Real-time order processing and inventory synchronization

#### Event Flow Example

```json
{
  "topic": "order",
  "key": "order-64f1a2b3c4d5e6f7g8h9i0j1",
  "value": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "user": "64f1a2b3c4d5e6f7g8h9i0j2",
    "status": "confirmed",
    "items": [
      {
        "candy": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "chocolate bar",
        "itemsInCart": 2,
        "price": 2.99
      }
    ],
    "totalPrice": 5.98,
    "address": "123 Main St, City, State 12345",
    "createdAt": "2023-10-01T10:00:00.000Z"
  }
}
```