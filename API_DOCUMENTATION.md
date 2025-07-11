# 🗓️ Booking System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 👥 Users Endpoints

### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CLIENT" // Optional: CLIENT, PROFESSIONAL, ADMIN (default: CLIENT)
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT"
  }
}
```

### Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
```http
GET /users/:id
```
**Authentication Required**

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CLIENT"
  }
}
```

### Update User
```http
PUT /users/:id
```
**Authentication Required**

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword123"
}
```

---

## 📅 Schedules Endpoints

### Create Schedule (Professionals Only)
```http
POST /schedules
```
**Authentication Required - Professional Role**

**Request Body:**
```json
{
  "date": "2024-01-15",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T10:00:00Z"
}
```

### Get Schedules by Professional
```http
GET /schedules?professional_id=1
```

**Response:**
```json
{
  "schedules": [
    {
      "id": 1,
      "userId": 1,
      "date": "2024-01-15T00:00:00.000Z",
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T10:00:00.000Z",
      "user": {
        "id": 1,
        "name": "Dr. Smith",
        "email": "dr.smith@example.com",
        "role": "PROFESSIONAL"
      }
    }
  ]
}
```

### Delete Schedule
```http
DELETE /schedules/:id
```
**Authentication Required - Professional Role**

---

## 📝 Bookings Endpoints

### Create Booking
```http
POST /bookings
```
**Authentication Required**

**Request Body:**
```json
{
  "professionalId": 1,
  "date": "2024-01-15",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "clientId": 2,
    "professionalId": 1,
    "date": "2024-01-15T00:00:00.000Z",
    "startTime": "2024-01-15T09:00:00.000Z",
    "endTime": "2024-01-15T10:00:00.000Z",
    "status": "PENDING",
    "client": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CLIENT"
    },
    "professional": {
      "id": 1,
      "name": "Dr. Smith",
      "email": "dr.smith@example.com",
      "role": "PROFESSIONAL"
    }
  }
}
```

### Get My Bookings
```http
GET /bookings/my-bookings
```
**Authentication Required**

**Response:**
```json
{
  "bookings": [
    {
      "id": 1,
      "clientId": 2,
      "professionalId": 1,
      "date": "2024-01-15T00:00:00.000Z",
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T10:00:00.000Z",
      "status": "PENDING",
      "client": { ... },
      "professional": { ... }
    }
  ]
}
```

### Cancel Booking
```http
PUT /bookings/:id/cancel
```
**Authentication Required - Professional Role**

### Confirm Booking
```http
PUT /bookings/:id/confirm
```
**Authentication Required - Professional Role**

---

## 🔔 Notifications Endpoints

### Get Notifications
```http
GET /notifications
```
**Authentication Required**

**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "userId": 1,
      "message": "New booking request from John Doe for 1/15/2024",
      "read": false,
      "user": { ... }
    }
  ]
}
```

### Mark Notification as Read
```http
PUT /notifications/:id/read
```
**Authentication Required**

### Get Unread Count
```http
GET /notifications/unread-count
```
**Authentication Required**

**Response:**
```json
{
  "unreadCount": 3
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/reservations_db"
JWT_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🔐 Role-Based Access

- **CLIENT**: Can create bookings, view their own bookings and notifications
- **PROFESSIONAL**: Can create schedules, manage bookings (confirm/cancel), view their bookings and notifications
- **ADMIN**: Full access to all features

---

## 📧 Email Features

The system automatically sends emails for:
- Booking confirmations
- Booking cancellations
- New booking notifications

Configure SMTP settings in your `.env` file to enable email functionality.

---

## 🛠️ Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a message:
```json
{
  "error": "Error description"
}
``` 