# FARO Issuer Dashboard - API Integration Guide

## Backend API Requirements

The dashboard expects your backend API to be running on `http://localhost:5000/api` by default.

## API Endpoints Used

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Students
```
GET /api/students?page=1&limit=10
POST /api/students
POST /api/students/bulk
GET /api/students/:studentId
```

### Certificates
```
POST /api/certificates
POST /api/certificates/download-template
POST /api/certificates/bulk-upload
GET /api/certificates/:certificateId
GET /api/certificates/issuer/:issuerId?page=1&limit=10
```

## Request Examples

### Login
```javascript
POST /api/auth/login
{
  "email": "admin@university.edu",
  "password": "password123"
}
```

### Create Student
```javascript
POST /api/students
Authorization: Bearer <token>
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Issue Certificate
```javascript
POST /api/certificates
Authorization: Bearer <token>
{
  "studentId": "uuid-here",
  "courseName": "Blockchain Development",
  "grade": "A+",
  "issueDate": "2024-12-05T00:00:00Z"
}
```

### Download Excel Template
```javascript
POST /api/certificates/download-template
Authorization: Bearer <token>
{
  "studentIds": ["uuid-1", "uuid-2"]
}
```

### Bulk Upload (Form Data)
```javascript
POST /api/certificates/bulk-upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: {
  file: <Excel file>
}
```

## Expected Response Format

All responses should follow this format:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

## Error Handling

Errors should return:

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Authentication

- JWT token stored in localStorage
- Token sent in Authorization header: `Bearer <token>`
- Auto-redirect to login on 401 responses

## CORS Configuration

Your backend must allow requests from `http://localhost:3000`:

```javascript
// Example CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Testing the Integration

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm start` (in dashboard folder)
3. Register/Login
4. Test each feature

## Troubleshooting

### CORS Errors
- Check backend CORS configuration
- Verify API URL in `.env`

### 401 Unauthorized
- Token may be expired
- Try logging out and back in

### Network Errors
- Ensure backend is running
- Check API URL configuration
- Verify endpoint paths match

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

Update this if your backend runs on a different port or domain.
