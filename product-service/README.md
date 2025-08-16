# 🍭 CandyHouse Product Service API

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [/candy](#candy)
  - [/candy/vendor](#candyvendor)
  - [/candy/{id}](#candyid)
  - [/image](#image)
- [Swagger Documentation](#swagger-documentation)
- [Caching Strategy for Candies](#caching-strategy-for-candies)



## Authentication

The API uses **JWT Bearer Token Authentication** obtained from the User Service. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**Authentication Requirements:**
- **Public Endpoints**: `/candy` (GET), `/candy/{id}` (GET), `/image` (GET)
- **Vendor-Only Endpoints**: `/candy` (POST), `/candy/{id}` (PATCH), `/candy/vendor` (GET)

## Endpoints

### /candy

#### `GET /candy`

- **Summary:** Get paginated list of all candies
- **Description:** Retrieves all candies with vendor information populated. Supports pagination for efficient data loading.
- **Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 6)
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "hasMore": true,
        "candies": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
            "name": "chocolate bar",
            "description": "Delicious dark chocolate bar with 70% cocoa",
            "price": 2.99,
            "quantity": 50,
            "appId": "candy-123-uuid",
            "vendor": {
              "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
              "name": "Sweet Treats Co",
              "email": "vendor@sweetreats.com",
              "appId": "vendor-456-uuid"
            },
            "photo": {
              "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/chocolate.jpg",
              "publicId": "candies/chocolate"
            },
            "createdAt": "2023-10-01T10:00:00.000Z",
            "updatedAt": "2023-10-01T10:00:00.000Z"
          }
        ]
      }
      ```

#### `POST /candy`

- **Summary:** Create a new candy product
- **Description:** Creates a new candy and publishes creation event to Kafka. Requires vendor authentication.
- **Authentication:** Vendor JWT required
- **Request Body:**
  ```json
  {
    "name": "gummy bears",
    "description": "Colorful fruit-flavored gummy bears",
    "price": 1.99,
    "quantity": 100,
    "photo": {
      "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/gummy.jpg",
      "publicId": "candies/gummy"
    }
  }
  ```
- **Responses:**
  - `200`: Candy created successfully
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User is not a vendor
  - `400`: Bad request - Invalid candy data

### /candy/vendor

#### `GET /candy/vendor`

- **Summary:** Get paginated candies for authenticated vendor
- **Description:** Retrieves all candies belonging to the authenticated vendor. Used for vendor dashboard and inventory management.
- **Authentication:** Vendor JWT required
- **Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of items per page (default: 6)
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "hasMore": false,
        "candies": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
            "name": "chocolate truffle",
            "description": "Premium Belgian chocolate truffle",
            "price": 4.99,
            "quantity": 25,
            "appId": "candy-abc-uuid",
            "vendor": "64f1a2b3c4d5e6f7g8h9i0j2",
            "photo": {
              "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/truffle.jpg",
              "publicId": "candies/truffle"
            },
            "createdAt": "2023-10-01T09:00:00.000Z",
            "updatedAt": "2023-10-01T09:00:00.000Z"
          }
        ]
      }
      ```
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User is not a vendor

### /candy/{id}

#### `GET /candy/{id}`

- **Summary:** Get candy details by ID
- **Description:** Retrieves detailed information about a specific candy. Implements intelligent caching - frequently accessed candies (5+ views) are cached for 1 hour.
- **Parameters:**
  - `id` (path): MongoDB ObjectId of the candy
- **Responses:**
  - `200`: Successful response
    - Example:
      ```json
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "milk chocolate bar",
        "description": "Creamy milk chocolate bar with almonds",
        "price": 3.49,
        "quantity": 75,
        "appId": "candy-def-uuid",
        "vendor": "64f1a2b3c4d5e6f7g8h9i0j2",
        "photo": {
          "url": "https://res.cloudinary.com/candyhouse/image/upload/v123/candies/milk-choc.jpg",
          "publicId": "candies/milk-choc"
        },
        "createdAt": "2023-10-01T08:00:00.000Z",
        "updatedAt": "2023-10-01T10:30:00.000Z"
      }
      ```
  - `404`: Candy not found

#### `PATCH /candy/{id}`

- **Summary:** Update candy details by ID
- **Description:** Updates candy information. Only the candy owner (vendor) can update their candies. Updates cache if candy is cached.
- **Authentication:** Vendor JWT required
- **Parameters:**
  - `id` (path): MongoDB ObjectId of the candy to update
- **Request Body:**
  ```json
  {
    "name": "premium dark chocolate",
    "description": "85% dark chocolate bar with sea salt",
    "price": 5.99,
    "quantity": 30,
    "photo": {
      "url": "https://res.cloudinary.com/candyhouse/image/upload/v124/candies/dark-choc.jpg",
      "publicId": "candies/dark-choc"
    }
  }
  ```
- **Responses:**
  - `200`: Candy updated successfully
  - `401`: Unauthorized - Invalid or missing JWT token
  - `403`: Forbidden - User is not the candy owner or not a vendor
  - `404`: Candy not found

### /image

#### `GET /image`

- **Summary:** Get signed URL for image upload
- **Description:** Generates a signed URL and signature for uploading images directly to Cloudinary. Used by frontend for secure image uploads.
- **Responses:**
  - `200`: Signed URL data generated successfully
    - Example:
      ```json
      {
        "folder": "candies",
        "api_key": "123456789012345",
        "url": "https://api.cloudinary.com/v1_1/candyhouse/image/upload",
        "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
        "timestamp": 1696161600
      }
      ```

## Swagger Documentation

For comprehensive API documentation, refer to the [Swagger Documentation](swagger.yaml) provided in this repository. The Swagger documentation includes:

- **Complete endpoint specifications** with request/response schemas
- **Authentication requirements** for each endpoint
- **Detailed examples** with realistic data
- **Error response codes** and descriptions
- **Interactive API testing** capabilities

Access the interactive documentation at: `http://localhost:4000/docs` (when running locally)

## Caching Strategy for Candies

The Product Service implements a **Cache-Aside (Lazy Loading) pattern** to optimize performance for frequently accessed candy details:

### 🎯 Caching Algorithm

1. **Initial Request**: When a candy is requested, check Redis cache using key `candy:<id>`
2. **Cache Hit**: If found, return cached data immediately (sub-millisecond response)
3. **Cache Miss**: Fetch from MongoDB and increment access counter (`candy:counter:<id>`)
4. **Frequency Threshold**: After 5+ accesses within 24 hours, cache the candy for 1 hour
5. **Cache Management**: Redis uses `allkeys-lru` eviction policy for optimal memory usage

### 🚀 Performance Benefits

- **⚡ Fast Response Times**: Popular candies served from cache in <50ms
- **📊 Memory Efficiency**: Only frequently accessed items are cached
- **🔄 Auto-Expiration**: 1-hour TTL prevents stale data
- **📈 Scalability**: Reduces database load for popular products

### 🏗️ Cache Architecture

```
Request Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│    Redis    │───▶│  MongoDB    │
│             │    │   Cache     │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                    │
                          ▼                    ▼
                   Cache Counter         Candy Data
                   (24h TTL)            (Source of Truth)
```

This strategy ensures optimal performance while maintaining data consistency and efficient resource utilization.

## Event-Driven Architecture

### 📡 Kafka Integration

The Product Service publishes real-time events to Apache Kafka for seamless integration with other microservices:

#### Published Events

**Topic: `candy`**
- **Event**: Product creation/updates
- **Consumers**: Order Service
- **Payload**: Complete candy object with vendor information
- **Use Case**: Real-time product catalog synchronization
