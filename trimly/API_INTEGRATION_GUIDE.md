# Trimly API Integration Guide

## Overview

This guide documents the API integration architecture for the Trimly application. The client-side implementation follows a modular service-layer pattern with automatic token management and error handling.

---

## Project Structure

```
trimly/
├── services/
│   └── authService.ts          # Authentication API service
├── utils/
│   └── apiClient.ts            # Core HTTP client with token management
├── types/
│   └── auth.types.ts           # TypeScript interfaces for authentication
├── API_DOCUMENTATION.md        # Complete API endpoint reference
└── API_INTEGRATION_GUIDE.md   # This file
```

---

## Core Components

### 1. API Client (`utils/apiClient.ts`)

The API client is a singleton class that handles all HTTP requests with automatic token management.

**Features**:
- Automatic access token injection for authenticated requests
- Automatic token refresh on 401 responses
- Token storage using AsyncStorage
- Support for GET, POST, PATCH, DELETE methods
- File upload support with `multipart/form-data`
- Comprehensive error handling

**Usage Example**:
```typescript
import apiClient from '@/utils/apiClient';

// GET request (authenticated)
const data = await apiClient.get('/auth/user/', true);

// POST request (public)
const response = await apiClient.post('/auth/login/', { email, password }, false);

// Upload file
const formData = new FormData();
formData.append('image', imageFile);
const result = await apiClient.upload('/salons/1/gallery/', formData, true);
```

**Token Management**:
```typescript
// Store tokens after login/registration
await apiClient.storeTokens(accessToken, refreshToken);

// Get cached user data
const user = await apiClient.getUserData();

// Clear tokens on logout
await apiClient.clearTokens();
```

---

### 2. Authentication Service (`services/authService.ts`)

High-level authentication API wrapper with automatic token storage.

**Available Methods**:

#### Register
```typescript
const response = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  role: 'customer', // 'customer' | 'salon_owner' | 'vendor' | 'admin'
});
// Automatically stores tokens and user data
// Returns: { user, tokens }
```

#### Login
```typescript
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});
// Automatically stores tokens and user data
// Returns: { access, refresh, user }
```

#### Logout
```typescript
await authService.logout();
// Clears all stored tokens and user data
```

#### Get Current User
```typescript
const user = await authService.getCurrentUser();
// Fetches fresh user data and updates cache
```

#### Update Profile
```typescript
const updatedUser = await authService.updateProfile({
  first_name: 'Jane',
  phone_number: '+1234567890',
});
```

#### Password Reset Flow
```typescript
// Step 1: Request reset email
await authService.requestPasswordReset({ email: 'user@example.com' });

// Step 2: User receives email with uid and token
// Step 3: Confirm reset with new password
await authService.confirmPasswordReset({
  uid: 'user-id',
  token: 'reset-token',
  new_password1: 'newpassword123',
  new_password2: 'newpassword123',
});
```

#### Check Authentication Status
```typescript
const isLoggedIn = await authService.isAuthenticated();
// Returns true if user has valid tokens
```

---

### 3. TypeScript Types (`types/auth.types.ts`)

All API request and response types are defined for type safety.

**Key Interfaces**:
```typescript
// User role
type UserRole = 'customer' | 'vendor' | 'salon_owner' | 'admin';

// User object
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  date_joined: string;
  profile_image?: string;
}

// Login request
interface LoginRequest {
  email: string;
  password: string;
}

// API Error
interface ApiError {
  status: number;
  message: string;
  data?: any;
}
```

---

## Integration Patterns

### Screen Integration Pattern

Standard pattern for integrating API calls in authentication screens:

```typescript
import { useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import authService from '@/services/authService';

export default function MyAuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = async () => {
    // 1. Reset errors
    setErrors({ email: '', password: '' });
    
    // 2. Validate input
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    
    // 3. Start loading
    setIsLoading(true);
    
    try {
      // 4. Make API call
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });
      
      console.log('Success:', response.user);
      
      // 5. Navigate based on role
      if (response.user.role === 'salon_owner' || response.user.role === 'vendor') {
        router.replace('/business/dashboard');
      } else {
        router.replace('/client/dashboard');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setIsLoading(false);
      
      // 6. Handle field-specific errors
      if (error.data) {
        if (error.data.email) {
          setErrors(prev => ({ 
            ...prev, 
            email: Array.isArray(error.data.email) 
              ? error.data.email[0] 
              : error.data.email 
          }));
        }
        if (error.data.password) {
          setErrors(prev => ({ 
            ...prev, 
            password: Array.isArray(error.data.password) 
              ? error.data.password[0] 
              : error.data.password 
          }));
        }
      }
      
      // 7. Show generic error
      Alert.alert(
        'Error',
        error.message || 'Operation failed. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    // UI with ActivityIndicator when isLoading is true
    <TouchableOpacity 
      onPress={handleSubmit}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text>Submit</Text>
      )}
    </TouchableOpacity>
  );
}
```

---

## Error Handling

### API Error Structure

All API errors follow a consistent structure:

```typescript
{
  status: 400,           // HTTP status code
  message: "Error text", // Human-readable message
  data: {                // Optional field-specific errors
    email: ["Email already exists"],
    password: ["Password too weak"],
    non_field_errors: ["Invalid credentials"]
  }
}
```

### Error Handling Best Practices

1. **Field-Specific Errors**: Check `error.data` for field-level validation errors
2. **Generic Errors**: Use `error.message` for user-facing error messages
3. **Network Errors**: Handle cases where `error.data` is undefined
4. **Loading States**: Always reset `isLoading` in catch blocks
5. **User Feedback**: Show `Alert.alert()` for critical errors

---

## Role Mapping

The frontend and backend use slightly different role names:

| Frontend Role | Backend Role  | Dashboard Route        |
|--------------|---------------|------------------------|
| `customer`   | `customer`    | `/client/dashboard`    |
| `vendor`     | `salon_owner` | `/business/dashboard`  |
| -            | `vendor`      | `/business/dashboard`  |
| -            | `admin`       | (Admin panel)          |

**Implementation**:
```typescript
// Map frontend role to backend
const apiRole = role === 'vendor' ? 'salon_owner' : role;

// Navigate based on backend role
if (user.role === 'salon_owner' || user.role === 'vendor') {
  router.replace('/business/dashboard');
} else {
  router.replace('/client/dashboard');
}
```

---

## Authentication Flow

### Registration Flow

1. User fills out sign-up form
2. Frontend validates input (email format, password length, etc.)
3. Call `authService.register(data)`
4. Service stores tokens and user data automatically
5. Navigate to appropriate dashboard based on role

### Login Flow

1. User enters email and password
2. Frontend validates input
3. Call `authService.login(data)`
4. Service stores tokens and user data automatically
5. Backend returns user's actual role
6. Navigate based on returned role (not URL param role)

### Password Reset Flow

1. User requests password reset
2. Call `authService.requestPasswordReset({ email })`
3. Backend sends reset email with uid and token
4. User clicks link in email
5. User enters new password
6. Call `authService.confirmPasswordReset({ uid, token, new_password1, new_password2 })`
7. Redirect to login

### Token Refresh Flow

Automatic - handled by API client:

1. API request returns 401 Unauthorized
2. Client automatically calls `/auth/token/refresh/` with refresh token
3. New access token stored
4. Original request retried with new token
5. If refresh fails, tokens cleared and user logged out

---

## Security Considerations

### Token Storage

- Tokens stored in AsyncStorage (React Native secure storage)
- Keys: `auth_token`, `refresh_token`, `user_data`
- Automatically cleared on logout or refresh failure

### Password Requirements

- Minimum 7 characters (enforced client and server-side)
- No special character requirements (per current backend)

### API Security

- All authenticated endpoints require `Authorization: Bearer <token>` header
- Tokens automatically injected by API client
- Never store passwords or sensitive data in plain text

---

## Testing Recommendations

### Manual Testing Checklist

- [ ] User can register with valid credentials
- [ ] User cannot register with existing email
- [ ] User can login with valid credentials
- [ ] User cannot login with invalid credentials
- [ ] User is redirected to correct dashboard based on role
- [ ] Password reset email is sent
- [ ] Tokens persist across app restarts
- [ ] Tokens refresh automatically on 401
- [ ] User is logged out when refresh token expires
- [ ] Error messages display correctly for field-level errors

### Test Credentials

Create test users for each role:
- Customer: `customer@test.com`
- Salon Owner: `owner@test.com`
- Vendor: `vendor@test.com`

---

## Next Steps

### Remaining Integrations

1. **Salon & Service APIs**
   - List salons
   - Get salon details
   - Create/update salon services
   - Upload gallery images

2. **Booking APIs**
   - Create booking
   - List user bookings
   - Update booking status
   - Cancel booking
   - Get available time slots

3. **Review APIs**
   - Create review
   - List salon reviews
   - Update own review

4. **Chat/Messaging APIs**
   - List conversations
   - Send messages
   - Initiate conversations

5. **Payment APIs**
   - Initialize payment
   - Create subaccounts
   - Request withdrawal

### Recommended Service Files

```
services/
├── authService.ts       ✅ COMPLETE
├── salonService.ts      ⏳ TODO
├── bookingService.ts    ⏳ TODO
├── reviewService.ts     ⏳ TODO
├── chatService.ts       ⏳ TODO
└── paymentService.ts    ⏳ TODO
```

---

## Troubleshooting

### Common Issues

**Issue**: "Authentication failed" after login
- **Solution**: Check if backend is running and accessible
- **Solution**: Verify email/password are correct
- **Solution**: Check console for detailed error messages

**Issue**: Token refresh loop
- **Solution**: Clear AsyncStorage and logout
- **Solution**: Check if refresh token is valid
- **Solution**: Verify backend token endpoint is working

**Issue**: Wrong dashboard after login
- **Solution**: Check role mapping logic
- **Solution**: Verify backend returns correct role
- **Solution**: Console log `response.user.role`

**Issue**: TypeScript errors
- **Solution**: Ensure all types imported from `@/types/auth.types`
- **Solution**: Check API response matches interface definitions

---

## API Base URL Configuration

**Current Base URL**: `https://trimly-app.onrender.com/api/v1/`

To change the base URL (e.g., for development):

1. Open `utils/apiClient.ts`
2. Modify the `API_BASE_URL` constant:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000/api/v1'; // Local dev
   ```

Consider using environment variables for different environments:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1'  // Development
  : 'https://trimly-app.onrender.com/api/v1'; // Production
```

---

## Additional Resources

- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Backend Swagger**: `https://trimly-app.onrender.com/api/docs/` (if available)
- **Expo Router Docs**: https://docs.expo.dev/router/introduction/
- **AsyncStorage Docs**: https://react-native-async-storage.github.io/async-storage/

---

**Last Updated**: January 27, 2026  
**Integration Status**: Authentication Complete ✅  
**Next Priority**: Salon & Booking Services
