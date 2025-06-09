# Auth Service API Endpoints

## 🔐 Authentication Endpoints

### Regular Authentication (Email/Password)

#### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "language": "en"
}
```

**Response:**
```json
{
  "message": "User registered successfully! Please check your email to verify your account."
}
```

#### 2. User Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["ROLE_USER"]
}
```

### OAuth2 Authentication

#### 1. Get Available OAuth2 Providers
```http
GET /auth/oauth2/providers
```

**Response:**
```json
[
  {
    "id": "github",
    "name": "GitHub",
    "authUrl": "https://hypertube.com:8443/api/auth/oauth2/authorization/github",
    "color": "#333333",
    "icon": "fab fa-github"
  },
  {
    "id": "google",
    "name": "Google", 
    "authUrl": "https://hypertube.com:8443/api/auth/oauth2/authorization/google",
    "color": "#4285f4",
    "icon": "fab fa-google"
  }
]
```

#### 2. OAuth2 Login (GitHub Example)
```http
GET /oauth2/authorization/github
```
This will redirect to GitHub for authorization, then back to your app.

## 🔧 Token Management

#### 3. Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. Logout
```http
POST /api/auth/signout
Authorization: Bearer <token>
```

## 👤 User Management

#### 5. Get Current User Info
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 6. Validate Token
```http
GET /api/auth/validate?token=<jwt_token>
```

## 🔑 Password Reset

#### 7. Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 8. Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
```

## ✅ Email Verification

#### 9. Verify Email
```http
GET /api/auth/verify-email?token=<verification_token>
```

## 🚨 Important Notes

### URLs to Use:

1. **Normal Signup (POST):** 
   ```
   https://hypertube.com:8443/api/auth/signup
   ```

2. **OAuth2 GitHub (GET - redirect):**
   ```
   https://hypertube.com:8443/api/auth/oauth2/authorization/github
   ```

3. **OAuth2 Google (GET - redirect):**
   ```
   https://hypertube.com:8443/api/auth/oauth2/authorization/google
   ```

### Common Mistakes:

❌ **Wrong:** GET request to `/api/auth/signup`  
✅ **Correct:** POST request to `/api/auth/signup`

❌ **Wrong:** Accessing OAuth2 URLs directly for signup  
✅ **Correct:** Use OAuth2 URLs only for OAuth2 login

❌ **Wrong:** Missing Content-Type header for POST requests  
✅ **Correct:** Always include `Content-Type: application/json`

### Frontend Implementation Example:

```javascript
// Regular signup
const signupUser = async (userData) => {
  const response = await fetch('https://hypertube.com:8443/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// OAuth2 redirect
const loginWithGitHub = () => {
  window.location.href = 'https://hypertube.com:8443/api/auth/oauth2/authorization/github';
};
``` 