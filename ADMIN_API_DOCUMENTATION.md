# Admin API Documentation

## Overview

This document provides comprehensive API documentation for the System Administrator functionality in the Store Rating Application.

## Authentication

All admin endpoints require authentication with a valid JWT token and ADMIN role.

**Headers Required:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Dashboard Statistics

### Get Dashboard Stats

**Endpoint:** `GET /api/admin/dashboard`

**Response:**

```json
{
  "total_users": 4,
  "total_stores": 7,
  "total_ratings": 2
}
```

## User Management

### Create User

**Endpoint:** `POST /api/admin/users`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "address": "123 Main St",
  "role": "USER|ADMIN|OWNER",
  "owner_id": "OWNER003" // Optional, only for OWNER role
}
```

**Response (201):**

```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St",
  "role": "USER",
  "owner_id": null,
  "message": "User created successfully with role: USER"
}
```

### List Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**

- `q` - Search query (searches name, email, address)
- `role` - Filter by role (ADMIN, USER, OWNER)
- `sort` - Sort field (name, email, address, role)
- `order` - Sort order (asc, desc)

**Example:** `GET /api/admin/users?q=john&role=USER&sort=name&order=asc`

**Response:**

```json
[
  {
    "id": 1,
    "name": "Sahil Balechand Rajubhai",
    "email": "sahil@gmail.com",
    "address": "Admin Address",
    "role": "ADMIN",
    "owner_id": null
  },
  {
    "id": 2,
    "name": "Karansinh Sandeep Jadhav",
    "email": "karan@gmail.com",
    "address": "Owner Address",
    "role": "OWNER",
    "owner_id": "OWNER001"
  }
]
```

### Get User Details

**Endpoint:** `GET /api/admin/users/:id`

**Response:**

```json
{
  "id": 2,
  "name": "Karansinh Sandeep Jadhav",
  "email": "karan@gmail.com",
  "address": "Owner Address",
  "role": "OWNER",
  "owner_id": "OWNER001",
  "owner_rating": 4.0
}
```

### Update User Owner ID

**Endpoint:** `PUT /api/admin/users/:id/owner-id`

**Request Body:**

```json
{
  "owner_id": "OWNER999"
}
```

**Response:**

```json
{
  "message": "Owner ID updated successfully",
  "user_id": 2,
  "owner_id": "OWNER999",
  "name": "Karansinh Sandeep Jadhav"
}
```

### Get Valid Owners

**Endpoint:** `GET /api/admin/owners`

**Response:**

```json
[
  {
    "id": 2,
    "name": "Karansinh Sandeep Jadhav",
    "email": "karan@gmail.com",
    "owner_id": "OWNER001"
  },
  {
    "id": 4,
    "name": "Hitesh Ranjeet Jadhav",
    "email": "hitesh@gmail.com",
    "owner_id": "OWNER002"
  }
]
```

## Store Management

### Create Store

**Endpoint:** `POST /api/admin/stores`

**Request Body:**

```json
{
  "name": "New Store",
  "email": "newstore@example.com",
  "address": "Store Address",
  "owner_id": 2 // Optional, must be valid OWNER user ID
}
```

**Response (201):**

```json
{
  "id": 8,
  "name": "New Store",
  "email": "newstore@example.com",
  "address": "Store Address",
  "owner_id": 2
}
```

### List Stores

**Endpoint:** `GET /api/admin/stores`

**Query Parameters:**

- `q` - Search query (searches name, email, address)
- `sort` - Sort field (name, email, address)
- `order` - Sort order (asc, desc)

**Response:**

```json
[
  {
    "id": 1,
    "name": "Sharma Kirana & General Store",
    "email": "sharma.kirana.kolhapur@example.com",
    "address": "Kolhapur, Maharashtra",
    "rating": 0.0
  },
  {
    "id": 6,
    "name": "Karan Healthcare",
    "email": "karan@gmail.com",
    "address": "Healthcare Address",
    "rating": 4.0
  }
]
```

### Update Store

**Endpoint:** `PUT /api/admin/stores/:id`

**Request Body:**

```json
{
  "name": "Updated Store Name",
  "email": "updated@example.com",
  "address": "Updated Address",
  "owner_id": 4
}
```

**Response:**

```json
{
  "message": "Store updated",
  "id": 1,
  "name": "Updated Store Name",
  "email": "updated@example.com",
  "address": "Updated Address",
  "owner_id": 4
}
```

## Authentication

### Logout

**Endpoint:** `POST /api/auth/logout`

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

### 409 Conflict

```json
{
  "error": "Email or Owner ID already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error message"
}
```

## Validation Rules

### User Creation

- **Name**: 20-60 characters, required
- **Email**: Valid email format, unique, required
- **Password**: 8-16 characters, must contain uppercase and special character, required
- **Address**: Maximum 400 characters, optional
- **Role**: Must be ADMIN, USER, or OWNER, required
- **Owner ID**: Maximum 20 characters, unique, optional (only for OWNER role)

### Store Creation

- **Name**: 1-60 characters, required
- **Email**: Valid email format, unique, required
- **Address**: Maximum 400 characters, optional
- **Owner ID**: Must be valid user ID with OWNER role, optional

## Business Rules

1. **Admin Limit**: Maximum 5 administrators allowed
2. **Owner ID Uniqueness**: Each owner_id must be unique across all users
3. **Role Validation**: Owner ID can only be assigned to users with OWNER role
4. **Store Ownership**: Stores can only be assigned to users with OWNER role
5. **Email Uniqueness**: Email addresses must be unique across users and stores

## Filtering and Sorting

### Available Sort Fields

- **Users**: name, email, address, role
- **Stores**: name, email, address

### Search Capabilities

- **Users**: Search by name, email, address
- **Stores**: Search by name, email, address

### Filter Options

- **Users**: Filter by role (ADMIN, USER, OWNER)
- **Stores**: No additional filters beyond search

## Rate Limiting

Currently no rate limiting implemented. Consider implementing rate limiting for production use.

## Security Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All admin operations require valid authentication
- Input validation prevents SQL injection
- CORS should be configured for production
