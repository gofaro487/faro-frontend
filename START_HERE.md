# FARO Issuer Dashboard - Development Quick Start

## 🎯 Start Everything in 2 Commands

### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```powershell
cd C:\Users\pulla\OneDrive\Desktop\faro\faro-backend
npm run dev
```

**Terminal 2 - Dashboard:**
```powershell
cd C:\Users\pulla\OneDrive\Desktop\faro\faro-issuer-dashboard
npm start
```

### Option 2: PowerShell Script

Create `start-faro.ps1`:
```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\pulla\OneDrive\Desktop\faro\faro-backend; npm run dev"

# Wait 5 seconds for backend to start
Start-Sleep -Seconds 5

# Start Dashboard
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\pulla\OneDrive\Desktop\faro\faro-issuer-dashboard; npm start"
```

Run:
```powershell
.\start-faro.ps1
```

## 🌐 Access Points

- **Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## ✅ First Time Setup Checklist

### Backend
- [x] Dependencies installed (`npm install`)
- [x] Database configured (`.env` with DATABASE_URL)
- [x] Migrations run (`npm run prisma:migrate`)
- [x] Blockchain configured (POLYGON_PRIVATE_KEY, CONTRACT_ADDRESS)
- [x] AWS S3 configured (AWS keys)
- [x] SendGrid configured (SENDGRID_API_KEY)

### Dashboard
- [x] Dependencies installed (`npm install`)
- [x] Environment configured (`.env` with API URL)
- [x] Build tested (`npm run build`)

## 🎬 Quick Demo Flow

1. **Start Both Servers** (see above)

2. **Open Dashboard** (http://localhost:3000)

3. **Register**
   - Click "Register here"
   - Institution: "Demo University"
   - Email: "admin@demo.edu"
   - Password: "password123"

4. **Add Students**
   - Go to "Students"
   - Click "Add Student"
   - Name: "John Doe"
   - Email: "john@demo.edu"
   - Add 2-3 more students

5. **Issue Single Certificate**
   - Go to "Issue Certificate"
   - Select "John Doe"
   - Course: "Blockchain Development"
   - Grade: "A+"
   - Issue Date: Today
   - Click "Issue Certificate"
   - Wait for blockchain confirmation ⛓️

6. **Bulk Upload**
   - Go to "Bulk Upload"
   - Select all students
   - Download template
   - Open Excel, fill in course details
   - Upload file
   - View results! ✅

7. **View Certificates**
   - Go to "Certificates"
   - See all issued certificates
   - Click eye icon for details
   - View blockchain transaction hash

## 🐛 Troubleshooting

### Port Already in Use

**Backend (5000):**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it
taskkill /PID <PID> /F
```

**Dashboard (3000):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
# Kill it
taskkill /PID <PID> /F
```

### Backend Won't Start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check if migrations ran: `npm run prisma:migrate`

### Dashboard Won't Start
- Check backend is running
- Verify REACT_APP_API_URL in .env
- Clear node_modules and reinstall: `rm -rf node_modules; npm install`

### Can't Login
- Check backend console for errors
- Verify database connection
- Try registering a new account

### CORS Errors
- Ensure backend has CORS enabled for http://localhost:3000
- Check browser console for specific error
- Restart both servers

## 📝 Development Tips

### Hot Reload
Both servers have hot reload enabled. Changes will reflect automatically.

### API Testing
Use the included Postman collection:
```
faro-backend/FARO-Backend.postman_collection.json
```

### Check Logs
- Backend logs appear in Terminal 1
- Dashboard logs appear in Terminal 2
- Browser console (F12) for frontend errors

### Database GUI
Use Prisma Studio to view database:
```powershell
cd faro-backend
npm run prisma:studio
```
Opens at: http://localhost:5555

## 🔄 Common Commands

### Backend
```powershell
npm run dev          # Start development server
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Database GUI
npm test             # Run tests (if available)
```

### Dashboard
```powershell
npm start            # Start development server
npm run build        # Production build
npm test             # Run tests
```

## 📚 Learning Resources

- **React**: https://react.dev
- **Material-UI**: https://mui.com
- **Express**: https://expressjs.com
- **Prisma**: https://prisma.io
- **Polygon**: https://docs.polygon.technology

## 🎉 You're Ready!

Everything is set up. Start developing and testing your blockchain-verified certificate system!

---

**Happy Coding! 💻⛓️**
