import mongoose from "mongoose";

/*
    # Database: ecommerce

# Collection: users

| Field | Type | Description |
|---|---|---|
| id | ObjectId | Unique identifier for the user |
| username | String | Username of the user |
| password | String | Password of the user |
| role | String | Role of the user (super user, vendor, or consumer) |

# Collection: vendors

| Field | Type | Description |
|---|---|---|
| id | ObjectId | Unique identifier for the vendor |
| name | String | Name of the vendor |
| email | String | Email address of the vendor |
| phone_number | String | Phone number of the vendor |
| address | String | Address of the vendor |
| city | String | City of the vendor |
| state | String | State of the vendor |
| zip_code | String | Zip code of the vendor |
| country | String | Country of the vendor |
| tax_id | String | Tax ID of the vendor |

# Collection: candies

| Field | Type | Description |
|---|---|---|
| id | ObjectId | Unique identifier for the candy |
| name | String | Name of the candy |
| description | String | Description of the candy |
| price | Number | Price of the candy |
| quantity | Number | Quantity of the candy in stock |
| image_url | String | URL of the image of the candy |
| vendor_id | ObjectId | ID of the vendor who sells the candy |

# Collection: orders

| Field | Type | Description |
|---|---|---|
| id | ObjectId | Unique identifier for the order |
| user_id | ObjectId | ID of the user who placed the order |
| vendor_id | ObjectId | ID of the vendor who sold the candy |
| candy_ids | Array | Array of IDs of the candies that were ordered |
| quantity | Number | Quantity of each candy that was ordered |
| total_price | Number | Total price of the order |
| status | String | Status of the order (pending, processing, shipped, delivered) |


    */
const localUri = process.env.MONGO_URI as string;
const connection = {} as any;
export async function connectDB() {
  if (connection.isConnected) {
    console.log("DB is already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0]?.readyState;
    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }

  const db = await mongoose.connect(localUri);
  console.log("? MongoDB Database Connected Successfully");
  connection.isConnected = db.connections[0]?.readyState;
}

export async function disconnectDB() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnected");
    }
  }
}
