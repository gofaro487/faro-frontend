# FARO Issuer Dashboard

A comprehensive React-based dashboard for educational institutions to issue and manage blockchain-verified certificates.

## 🌟 Features

### Authentication
- **Login** - Secure issuer authentication
- **Register** - New institution registration
- **Protected Routes** - JWT-based authentication

### Student Management
- **View Students** - Paginated student list
- **Add Student** - Single student creation
- **Bulk Add Students** - CSV-based bulk student import
- **Student Details** - Individual student information

### Certificate Issuance
- **Issue Certificate** - Single certificate issuance with blockchain verification
- **Custom Fields** - Support for custom certificate fields (Credits, Department, etc.)
- **Real-time Status** - View blockchain transaction status
- **Grade Support** - Multiple grading formats (A+, 95%, Pass, etc.)

### Bulk Operations
- **Download Template** - Pre-filled Excel template with student data
- **Fill Template** - Add certificate details to Excel
- **Bulk Upload** - Issue multiple certificates at once
- **Results Dashboard** - View success/failure statistics
- **Blockchain Verification** - Each certificate verified individually on blockchain

### Certificate Management
- **View All Certificates** - Paginated certificate list
- **Certificate Details** - Full certificate information
- **Blockchain Info** - Transaction hash and certificate hash
- **Download PDF** - Export certificates
- **Status Tracking** - Real-time certificate status

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher
- npm or yarn
- FARO Backend running on http://localhost:5000

### Installation

1. **Navigate to project directory**
   ```bash
   cd faro-issuer-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env` if needed
   - Default API URL: http://localhost:5000/api
   - Update `REACT_APP_API_URL` if your backend is on a different port

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to http://localhost:3000
   - You'll be redirected to the login page

## 📁 Project Structure

```
faro-issuer-dashboard/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.js
│   ├── config/              # Configuration files
│   │   └── api.js          # API endpoints configuration
│   ├── context/             # React Context providers
│   │   └── AuthContext.js  # Authentication context
│   ├── layouts/             # Layout components
│   │   └── DashboardLayout.js
│   ├── pages/               # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Students.js
│   │   ├── IssueCertificate.js
│   │   ├── BulkUpload.js
│   │   └── Certificates.js
│   ├── services/            # API service layers
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   └── certificateService.js
│   ├── theme/               # Material-UI theme
│   │   └── theme.js
│   ├── App.js              # Main app component with routing
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🛠 Technology Stack

- **React** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation and routing
- **Axios** - HTTP client
- **XLSX** - Excel file handling
- **File-saver** - File download utility

## 📋 Usage Guide

### 1. Register/Login
- Access the login page at http://localhost:3000
- New institutions: Click "Register here"
- Existing users: Enter email and password

### 2. Dashboard Overview
- View statistics: Total students, certificates issued
- Quick access to all features
- System status indicators

### 3. Manage Students
- **Add Single Student**: Click "Add Student" button
- **Bulk Add**: Click "Bulk Add" and paste CSV data (Name,Email format)
- **View Students**: Browse paginated list
- **Search & Filter**: Find specific students

### 4. Issue Certificates

#### Single Certificate
1. Go to "Issue Certificate"
2. Select a student from dropdown
3. Fill in certificate details:
   - Course Name (required)
   - Grade (required)
   - Issue Date (required)
   - Optional: Credits, Department, Instructor
4. Click "Issue Certificate"
5. Wait for blockchain confirmation

#### Bulk Upload
1. Go to "Bulk Upload"
2. **Step 1**: Select students to receive certificates
3. **Step 2**: Download pre-filled Excel template
4. **Step 3**: Fill in certificate details in Excel:
   - Course Name
   - Grade
   - Issue Date
   - Optional custom fields
5. **Step 4**: Upload completed Excel file
6. View results and blockchain transaction hashes

### 5. View Certificates
- Browse all issued certificates
- View detailed information
- Check blockchain verification status
- Download certificate PDFs

## 🔐 Authentication

The dashboard uses JWT-based authentication:
- Tokens stored in localStorage
- Automatic token attachment to requests
- Auto-redirect on token expiration
- Secure logout functionality

## 🌐 API Integration

### Base URL
Default: `http://localhost:5000/api`

### Endpoints Used
- `POST /auth/register` - Register new issuer
- `POST /auth/login` - Login
- `GET /auth/me` - Get profile
- `GET /students` - List students
- `POST /students` - Create student
- `POST /students/bulk` - Bulk create students
- `POST /certificates` - Issue certificate
- `POST /certificates/download-template` - Download Excel template
- `POST /certificates/bulk-upload` - Bulk upload certificates
- `GET /certificates/issuer/:id` - List issuer's certificates
- `GET /certificates/:id` - Get certificate details

## 🎨 Customization

### Theme
Edit `src/theme/theme.js` to customize:
- Colors
- Typography
- Component styles
- Spacing

### API URL
Update `.env`:
```
REACT_APP_API_URL=https://your-api-url.com/api
```

### Logo
Replace logo in `public/` folder and update references

## 📦 Build & Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy
The build folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🔧 Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=FARO Issuer Dashboard
```

## 🐛 Troubleshooting

### Cannot connect to API
- Ensure backend is running on http://localhost:5000
- Check CORS configuration in backend
- Verify API URL in `.env`

### Login fails
- Check network tab for errors
- Verify credentials
- Ensure backend database is connected

### Excel upload fails
- Check file format (.xlsx or .xls)
- Verify required columns are filled
- Check file size (max 5MB)
- Ensure student IDs match database

## 📝 Development Notes

### Code Style
- Functional components with hooks
- Material-UI best practices
- Responsive design
- Error handling on all API calls

### State Management
- Context API for authentication
- Local state for component data
- Service layer for API calls

### Security
- JWT tokens in localStorage
- Protected routes
- Automatic token refresh handling
- XSS protection via React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the FARO platform.

## 🆘 Support

For issues or questions:
- Check backend API documentation
- Review console errors
- Verify network requests
- Contact development team

## 🚀 Future Enhancements

- [ ] Certificate PDF generation
- [ ] Advanced search and filters
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Certificate templates
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Export reports

---

**Built with ❤️ for educational institutions**
