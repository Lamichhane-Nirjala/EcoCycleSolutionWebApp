# Smart Waste Pickup System - API Documentation

## Overview
The Smart Waste Pickup System is an Uber-style waste pickup feature for the EcoCycle platform. It allows users to request waste pickups and enables admins to manage pickup requests and assign drivers.

## Database Schema

### Pickups Table
```
pickupId (UUID) - Primary Key
userId (INTEGER) - Foreign Key to users table
wasteType (STRING) - Type of waste (e.g., plastic, paper, metal, organic, mixed)
estimatedWeight (DECIMAL) - Weight in kg
pickupAddress (TEXT) - Full pickup address
latitude (DECIMAL) - Latitude for location mapping
longitude (DECIMAL) - Longitude for location mapping
status (ENUM) - Pending, Assigned, In Progress, Completed, Cancelled
driverId (INTEGER) - ID of assigned driver
requestedAt (TIMESTAMP) - When request was created
scheduledTime (TIMESTAMP) - When pickup is scheduled
completedAt (TIMESTAMP) - When pickup was completed
notes (TEXT) - Admin/driver notes
createdAt (TIMESTAMP) - Record creation time
updatedAt (TIMESTAMP) - Last update time
```

## API Endpoints

### USER ENDPOINTS (Require Authentication)

#### 1. Request a Waste Pickup
**POST** `/api/pickup/request`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "wasteType": "plastic",
  "estimatedWeight": 15.5,
  "pickupAddress": "123 Main St, City, State 12345",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "scheduledTime": "2026-03-10T10:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pickup request created successfully",
  "data": {
    "pickupId": "uuid-string",
    "userId": 1,
    "wasteType": "plastic",
    "estimatedWeight": 15.5,
    "pickupAddress": "123 Main St, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "Pending",
    "driverId": null,
    "requestedAt": "2026-03-05T10:00:00Z",
    "scheduledTime": "2026-03-10T10:00:00Z",
    "completedAt": null,
    "notes": null
  }
}
```

---

#### 2. Get User's Pickup History
**GET** `/api/pickup/my-pickups?status=Pending&limit=10&offset=0`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional) - Filter by status (Pending, Assigned, In Progress, Completed, Cancelled)
- `limit` (optional, default: 10) - Number of records to fetch
- `offset` (optional, default: 0) - Pagination offset

**Response (200):**
```json
{
  "success": true,
  "message": "User pickups retrieved successfully",
  "data": [
    {
      "pickupId": "uuid-1",
      "userId": 1,
      "wasteType": "plastic",
      "estimatedWeight": 15.5,
      "pickupAddress": "123 Main St",
      "status": "Pending",
      "driverId": null,
      "requestedAt": "2026-03-05T10:00:00Z",
      "scheduledTime": "2026-03-10T10:00:00Z",
      "completedAt": null
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

---

#### 3. Get Single Pickup Details
**GET** `/api/pickup/:pickupId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pickup details retrieved successfully",
  "data": {
    "pickupId": "uuid-string",
    "userId": 1,
    "wasteType": "plastic",
    "estimatedWeight": 15.5,
    "pickupAddress": "123 Main St, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "Pending",
    "driverId": null,
    "requestedAt": "2026-03-05T10:00:00Z",
    "scheduledTime": "2026-03-10T10:00:00Z",
    "completedAt": null,
    "notes": null
  }
}
```

---

#### 4. Cancel a Pickup Request
**PUT** `/api/pickup/cancel/:pickupId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Unable to provide this much space"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pickup request cancelled successfully",
  "data": {
    "pickupId": "uuid-string",
    "status": "Cancelled",
    "notes": "Unable to provide this much space"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Cannot cancel a pickup with status: Completed"
}
```

---

### ADMIN ENDPOINTS (Require Admin Authentication)

#### 1. Get All Pickup Requests
**GET** `/api/pickup/admin/all?status=Pending&userId=1&driverId=2&limit=20&offset=0`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status` (optional) - Filter by status
- `userId` (optional) - Filter by user ID
- `driverId` (optional) - Filter by driver ID
- `limit` (optional, default: 20) - Records per page
- `offset` (optional, default: 0) - Pagination offset

**Response (200):**
```json
{
  "success": true,
  "message": "All pickups retrieved successfully",
  "data": [
    {
      "pickupId": "uuid-1",
      "userId": 1,
      "wasteType": "plastic",
      "estimatedWeight": 15.5,
      "pickupAddress": "123 Main St",
      "status": "Pending",
      "driverId": null,
      "requestedAt": "2026-03-05T10:00:00Z",
      "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "number": "555-1234",
        "city": "New York"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

#### 2. Assign Driver to Pickup
**PUT** `/api/pickup/admin/assign/:pickupId`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "driverId": 5,
  "scheduledTime": "2026-03-10T14:00:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Driver assigned successfully",
  "data": {
    "pickupId": "uuid-string",
    "status": "Assigned",
    "driverId": 5,
    "scheduledTime": "2026-03-10T14:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Selected user is not authorized as a driver"
}
```

---

#### 3. Update Pickup Status
**PUT** `/api/pickup/admin/status/:pickupId`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "In Progress",
  "notes": "Driver is on the way"
}
```

**Valid Status Values:**
- `Pending`
- `Assigned`
- `In Progress`
- `Completed`
- `Cancelled`

**Response (200):**
```json
{
  "success": true,
  "message": "Pickup status updated successfully",
  "data": {
    "pickupId": "uuid-string",
    "status": "In Progress",
    "notes": "Driver is on the way"
  }
}
```

**Note:** When status is changed to "Completed", `completedAt` is automatically set to current timestamp.

---

#### 4. Get Pickup Statistics
**GET** `/api/pickup/admin/stats`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pickup statistics retrieved successfully",
  "data": {
    "totalPickups": 50,
    "statusBreakdown": {
      "pending": 5,
      "assigned": 8,
      "inProgress": 3,
      "completed": 32,
      "cancelled": 2
    },
    "totalRecycledWeight": 450.75,
    "wasteTypeBreakdown": [
      {
        "wasteType": "plastic",
        "count": 15,
        "totalWeight": 125.50
      },
      {
        "wasteType": "paper",
        "count": 10,
        "totalWeight": 185.25
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "wasteType, estimatedWeight, and pickupAddress are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization token missing"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized: Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Pickup request not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Setup Instructions

### 1. Run Database Initialization
```bash
node init-db.js
```

This will create the `pickups` table and necessary indexes.

### 2. Verify Routes are Registered
Check that `server.js` has the pickup router imported and registered:
```javascript
import pickupRouter from "./Router/pickupRouter.js";
app.use("/api/pickup", pickupRouter);
```

### 3. Start the Server
```bash
npm start
```

---

## Authentication Requirements

### User Endpoints
- Use the JWT token obtained from `/api/auth/login` endpoint
- Token should be passed in Authorization header: `Bearer <token>`

### Admin Endpoints
- User must have `usertype` = "Admin" in the database
- Same JWT token authentication as user endpoints
- Additional admin authorization is checked via `adminAuth` middleware

---

## File Structure
```
Backend/
├── Model/
│   └── pickupModel.js          # Pickup database model
├── Controller/
│   └── pickupController.js      # Pickup business logic
├── Router/
│   └── pickupRouter.js          # Pickup API routes
├── Middleware/
│   └── adminAuth.js             # Admin authorization middleware
├── init-db.js                   # Updated with pickups table
└── server.js                    # Updated with pickup routes
```

---

## Example Usage with cURL

### Request a Pickup
```bash
curl -X POST http://localhost:5000/api/pickup/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "wasteType": "plastic",
    "estimatedWeight": 15.5,
    "pickupAddress": "123 Main St, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "scheduledTime": "2026-03-10T10:00:00Z"
  }'
```

### Get My Pickups
```bash
curl -X GET "http://localhost:5000/api/pickup/my-pickups?status=Pending&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin: Get All Pickups
```bash
curl -X GET "http://localhost:5000/api/pickup/admin/all?status=Pending" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Admin: Assign Driver
```bash
curl -X PUT http://localhost:5000/api/pickup/admin/assign/PICKUP_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "driverId": 5,
    "scheduledTime": "2026-03-10T14:00:00Z"
  }'
```

### Admin: Update Status
```bash
curl -X PUT http://localhost:5000/api/pickup/admin/status/PICKUP_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completed",
    "notes": "Pickup completed successfully"
  }'
```

---

## Best Practices

1. **Validation**: All inputs are validated before processing
2. **Authorization**: Every endpoint checks user authentication and required permissions
3. **Error Handling**: All errors return appropriate HTTP status codes
4. **Database Indexes**: Pickup status, userId, and driverId are indexed for faster queries
5. **Timestamps**: All records include createdAt and updatedAt for audit trails
6. **Pagination**: List endpoints support pagination for large datasets

---

## Future Enhancements

- Real-time notifications when pickup status changes
- Email/SMS notifications to users
- Map integration for location selection
- Pickup rating/review system
- Driver performance metrics
- Analytics dashboard for eco-impact tracking
