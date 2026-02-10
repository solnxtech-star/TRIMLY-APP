# Trimly API Documentation (v1)

**Base URL:** `https://trimly-app.onrender.com/api/v1/`

**Last Updated:** January 2026

---

## Table of Contents
1. [Roles & Access Control](#roles--access-control)
2. [Authentication & Users](#1-authentication-and-users)
3. [Salons & Services](#2-salons-and-services)
4. [Bookings & Availability](#3-bookings-and-availability)
5. [Reviews & Messaging](#4-reviews-and-messaging)
6. [Payments & Categories](#5-payments-and-categories)

---

## Roles & Access Control

The Trimly platform utilizes distinct roles to manage permissions and access across the API resources.

| Role | Description | Access Rights |
|------|-------------|---------------|
| **Customer** | Books services, writes reviews, manages own profile | Read/Write to own `/bookings`, `/reviews`. Read-only on `/salons`, `/services`, `/vendors` |
| **Salon Owner** | Manages one or more salon profiles, services, bookings | Read/Write to owned `/salons/{id}` and related `/bookings`, `/services` |
| **Vendor** | Individual service provider, manages own availability | Read/Write to own `/vendors/{id}`, `/services`, `/availability` |
| **Admin** | Full system oversight | Unrestricted CRUD access to all resources |

---

## 1. Authentication and Users

Endpoints related to user registration, session management, and profile retrieval.

### 1.1 Authentication Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Auth** | POST | `/auth/registration/` | Registers a new user (email, password, role, etc.) | Public | `{ email, password1, password2, role, phone_number }` | `{ access, refresh, user: { id, email, username, first_name, last_name, phone_number, role, salon_profile?, vendor_profile? } }` |
| **Auth** | POST | `/auth/login/` | Authenticates user and returns JWT tokens | Public | `{ email, password }` | `{ access, refresh, user: { id, email, username, first_name, last_name, phone_number, role, salon_profile?, vendor_profile? } }` |
| **Auth** | POST | `/auth/logout/` | Invalidates the current session/token | Authenticated | `{ refresh }` | `{ detail }` |
| **Auth** | POST | `/auth/token/refresh/` | Refreshes access token using refresh token | Authenticated | `{ refresh }` | `{ access }` |
| **Auth** | POST | `/auth/google/` | Google social login | Public | `{ access_token }` | `{ access, refresh, user }` |
| **Auth** | POST | `/auth/password/change/` | Change password | Authenticated | `{ old_password, new_password1, new_password2 }` | `{ detail }` |
| **Auth** | POST | `/auth/password/reset/` | Request password reset email | Public | `{ email }` | `{ detail }` |
| **Auth** | POST | `/auth/password/reset/confirm/` | Confirm password reset | Public | `{ uid, token, new_password1, new_password2 }` | `{ detail }` |

### 1.2 User Profile Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **User** | GET | `/auth/user/` | Get current user profile | Authenticated | - | `{ id, email, username, first_name, last_name, phone_number, role, salon_profile?, vendor_profile? }` |
| **User** | PATCH | `/auth/user/` | Update current user profile (first_name, last_name, phone_number, etc.) | Authenticated | `{ first_name?, last_name?, phone_number?, ... }` | `{ id, email, username, first_name, last_name, ... }` |
| **User** | GET | `/auth/users/{id}/` | Get specific user details | Admin only | - | `{ id, email, username, first_name, last_name, ... }` |

---

## 2. Salons and Services

### 2.1 Salon Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Salon** | GET | `/salons/` | List all salons (public discovery) | Public | Query: `?search=`, `?location=`, `?category=` | `[{ id, name, description, location, ... }]` |
| **Salon** | POST | `/salons/` | Create new salon profile | Salon Owner / Admin | `{ name, description, location, phone_number, ... }` | `{ id, name, description, ... }` |
| **Salon** | GET | `/salons/{id}/` | Get salon details | Public | - | `{ id, name, description, location, services, gallery, reviews, ... }` |
| **Salon** | PATCH | `/salons/{id}/` | Update salon information | Owner / Admin | `{ name?, description?, location?, ... }` | `{ id, name, description, ... }` |

### 2.2 Service Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Service** | POST | `/salons/{id}/services/` | Create new service for salon | Owner / Admin | `{ name, description, price, duration, category }` | `{ id, name, description, price, ... }` |
| **Service** | GET | `/salons/{id}/services/` | List all services of a salon | Public | - | `[{ id, name, description, price, duration, ... }]` |

### 2.3 Gallery Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Gallery** | POST | `/salons/{id}/gallery/` | Upload image to salon gallery | Owner / Admin | `FormData: { image }` | `{ id, image_url, uploaded_at }` |
| **Gallery** | GET | `/salons/{id}/gallery/` | Get all gallery images | Public | - | `[{ id, image_url, uploaded_at }]` |

### 2.4 Vendor Endpoints

> **Note:** Vendor services and galleries follow similar patterns under `/vendors/{vendor_id}/...`

| Resource | Method | Endpoint | Description | Access |
|----------|--------|----------|-------------|--------|
| **Vendor** | GET | `/vendors/` | List all vendors | Public |
| **Vendor** | POST | `/vendors/` | Create vendor profile | Vendor / Admin |
| **Vendor** | GET | `/vendors/{id}/` | Get vendor details | Public |
| **Vendor** | PATCH | `/vendors/{id}/` | Update vendor information | Vendor / Admin |
| **Vendor Service** | POST | `/vendors/{id}/services/` | Create vendor service | Vendor / Admin |
| **Vendor Service** | GET | `/vendors/{id}/services/` | List vendor services | Public |
| **Vendor Gallery** | POST | `/vendors/{id}/gallery/` | Upload vendor gallery image | Vendor / Admin |
| **Vendor Gallery** | GET | `/vendors/{id}/gallery/` | Get vendor gallery images | Public |

---

## 3. Bookings and Availability

### 3.1 Booking Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Booking** | POST | `/bookings/` | Create new booking | Customer | `{ salon_id?, vendor_id?, service_id, date, time_slot, notes? }` | `{ id, status, salon, vendor, service, date, time_slot, ... }` |
| **Booking** | GET | `/bookings/` | List / filter bookings (role-based) | Authenticated | Query: `?status=`, `?date=`, `?salon_id=` | `[{ id, status, salon, vendor, service, date, ... }]` |
| **Booking** | GET | `/bookings/{id}/` | Get booking details | Authenticated | - | `{ id, status, salon, vendor, service, customer, date, time_slot, ... }` |
| **Booking** | PATCH | `/bookings/{id}/` | Update booking (status, details) | Customer / Owner / Vendor | `{ status?, date?, time_slot?, notes? }` | `{ id, status, date, time_slot, ... }` |
| **Booking** | DELETE | `/bookings/{id}/` | Cancel booking | Customer / Owner / Vendor | - | `{ detail }` |

### 3.2 Booking Actions

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Action** | POST | `/bookings/{id}/complete/` | Mark booking as completed | Owner / Vendor / Admin | - | `{ id, status: "completed", ... }` |
| **Action** | POST | `/bookings/{id}/cancel/` | Cancel booking (alternative endpoint) | Customer / Owner / Vendor | `{ reason? }` | `{ id, status: "cancelled", ... }` |

### 3.3 Availability

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Availability** | GET | `/vendors/{id}/available-slots/` | Get available time slots | Public | Query: `?date=YYYY-MM-DD`, `?service_id=` | `{ date, available_slots: ["09:00", "10:00", ...] }` |

---

## 4. Reviews and Messaging

### 4.1 Review Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Review** | POST | `/salons/{id}/reviews/` | Create review for salon | Customer | `{ rating, comment, booking_id? }` | `{ id, rating, comment, customer, created_at, ... }` |
| **Review** | GET | `/salons/{id}/reviews/` | List reviews | Public | Query: `?rating=`, `?sort=` | `[{ id, rating, comment, customer, created_at, ... }]` |
| **Review** | PATCH | `/reviews/{id}/` | Edit own review | Customer | `{ rating?, comment? }` | `{ id, rating, comment, ... }` |

### 4.2 Chat & Messaging Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Chat** | GET | `/conversations/` | List user's conversations | Authenticated | - | `[{ id, participants, last_message, unread_count, ... }]` |
| **Chat** | POST | `/conversations/initiate/{target_id}/` | Start new conversation | Authenticated | `{ initial_message? }` | `{ id, participants, created_at, ... }` |
| **Chat** | GET | `/conversations/{id}/messages/` | Get messages in conversation | Authenticated | Query: `?page=`, `?limit=` | `{ results: [{ id, sender, content, timestamp, ... }], next, previous }` |
| **Chat** | POST | `/conversations/{id}/messages/` | Send new message | Authenticated | `{ content, attachment? }` | `{ id, sender, content, timestamp, ... }` |

---

## 5. Payments and Categories

### 5.1 Payment Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Payment** | POST | `/payments/initialize/` | Start payment for a booking | Customer | `{ booking_id, payment_method }` | `{ payment_id, authorization_url, reference, ... }` |
| **Payment** | POST | `/payments/create_subaccounts/` | Create payment subaccount | Owner / Vendor | `{ business_name, bank_code, account_number, ... }` | `{ subaccount_id, subaccount_code, ... }` |
| **Payment** | POST | `/payments/withdraw/` | Request withdrawal | Owner / Vendor | `{ amount, account_id }` | `{ withdrawal_id, status, amount, ... }` |

### 5.2 Category Endpoints

| Resource | Method | Endpoint | Description | Access | Request Body | Response |
|----------|--------|----------|-------------|--------|--------------|----------|
| **Category** | GET | `/category/` | List all service categories | Public | - | `[{ id, name, description, icon? }]` |
| **Category** | POST | `/category/` | Create new category | Admin only | `{ name, description, icon? }` | `{ id, name, description, icon }` |
| **Category** | DELETE | `/category/{id}/` | Delete category | Admin only | - | `{ detail }` |

---

## Common Response Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request successful, no content to return |
| `400 Bad Request` | Invalid request data |
| `401 Unauthorized` | Authentication required or token invalid |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server error |

---

## Authentication Headers

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Notes

- All dates should be in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`
- All endpoints return JSON responses
- File uploads should use `multipart/form-data` content type
- Pagination is available on list endpoints using `?page=` and `?limit=` query parameters
