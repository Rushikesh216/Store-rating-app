# Owner ID Management Guide

## Overview

This guide explains how to manage unique Owner IDs for users with the OWNER role in the store rating application.

## Database Schema Changes

### New Field Added

- **Field**: `owner_id` (VARCHAR(20))
- **Constraint**: UNIQUE
- **Purpose**: Unique identifier for store owners
- **Nullable**: Yes (owners can exist without an owner_id initially)

### Migration Applied

The database has been updated with:

- New `owner_id` column in `users` table
- Unique constraint on `owner_id`
- Index for performance
- Sample owner IDs assigned to existing owners

## API Endpoints

### 1. Create User with Owner ID

```http
POST /api/admin/users
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "name": "John Doe Store Owner",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "address": "123 Main St",
  "role": "OWNER",
  "owner_id": "OWNER003"
}
```

### 2. Update Owner ID

```http
PUT /api/admin/users/{user_id}/owner-id
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "owner_id": "OWNER004"
}
```

### 3. Get All Owners with Owner IDs

```http
GET /api/admin/owners
Authorization: Bearer <admin_token>
```

### 4. List All Users (includes owner_id)

```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

## Validation Rules

### Owner ID Requirements

- **Format**: String, maximum 20 characters
- **Uniqueness**: Must be unique across all users
- **Role Restriction**: Can only be assigned to users with 'OWNER' role
- **Case Sensitive**: 'OWNER001' and 'owner001' are different

### Error Handling

- **Duplicate Owner ID**: Returns 400 with message "Owner ID 'X' is already taken"
- **Invalid Role**: Returns 400 with message "Owner ID can only be assigned to users with OWNER role"
- **Format Error**: Returns 400 with message "Owner ID must be a string with maximum 20 characters"

## Current Owner IDs

| User ID | Name                     | Email            | Owner ID |
| ------- | ------------------------ | ---------------- | -------- |
| 2       | Karansinh Sandeep Jadhav | karan@gmail.com  | OWNER001 |
| 4       | Hitesh Ranjeet Jadhav    | hitesh@gmail.com | OWNER002 |

## Usage Examples

### Creating a New Owner with Owner ID

```javascript
const response = await fetch("/api/admin/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    name: "New Store Owner",
    email: "newowner@example.com",
    password: "SecurePass123!",
    role: "OWNER",
    owner_id: "OWNER003",
  }),
});
```

### Updating an Existing Owner's ID

```javascript
const response = await fetch("/api/admin/users/2/owner-id", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    owner_id: "OWNER999",
  }),
});
```

### Getting Available Owner IDs

```javascript
const response = await fetch("/api/admin/owners", {
  headers: {
    Authorization: `Bearer ${adminToken}`,
  },
});
const owners = await response.json();
// Returns: [{id: 2, name: "Karansinh Sandeep Jadhav", email: "karan@gmail.com", owner_id: "OWNER001"}, ...]
```

## Best Practices

1. **Naming Convention**: Use consistent format like "OWNER001", "OWNER002", etc.
2. **Validation**: Always check if owner_id is available before assignment
3. **Error Handling**: Handle duplicate owner_id errors gracefully
4. **Role Verification**: Ensure user has 'OWNER' role before assigning owner_id
5. **Cleanup**: Remove owner_id when changing user role from 'OWNER' to another role

## Migration Notes

- Existing owners have been assigned sample owner IDs (OWNER001, OWNER002)
- The migration is idempotent and can be run multiple times safely
- All existing functionality remains unchanged
- New owner_id field is optional and backward compatible
