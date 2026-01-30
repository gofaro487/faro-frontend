# FARO Issuer Dashboard - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Install & Run
```bash
cd faro-issuer-dashboard
npm install
npm start
```

### 2. First Time Setup
1. Open http://localhost:3000
2. Click "Register here"
3. Enter your institution name, email, and password
4. You're in! 🎉

## 📚 Common Tasks

### Add Students
**Single Student:**
1. Dashboard → Students → "Add Student"
2. Enter name and email
3. Click "Add Student"

**Bulk Students:**
1. Dashboard → Students → "Bulk Add"
2. Paste data in format: `Name,Email` (one per line)
3. Example:
   ```
   John Doe,john@example.com
   Jane Smith,jane@example.com
   ```

### Issue Single Certificate
1. Dashboard → "Issue Certificate"
2. Select student from dropdown
3. Fill in:
   - Course Name: "Blockchain Development"
   - Grade: "A+"
   - Issue Date: Select date
4. Click "Issue Certificate"
5. Wait 5-10 seconds for blockchain confirmation ⛓️

### Bulk Issue Certificates (Excel)
1. Dashboard → "Bulk Upload"
2. **Select Students** - Check students who need certificates
3. **Download Template** - Click download button
4. **Fill Excel:**
   - Open downloaded file
   - Fill columns: Course Name, Grade, Issue Date
   - DON'T change Student ID, Name, Email
   - Add custom columns if needed (Credits, Department)
5. **Upload** - Choose filled Excel file
6. View results! ✅

### View Certificates
1. Dashboard → "Certificates"
2. See all issued certificates
3. Click 👁️ to view details and blockchain info

## 🔑 Key Features

✅ Blockchain verification for every certificate  
✅ Excel bulk upload (50 certificates at once)  
✅ Custom fields support  
✅ Real-time transaction tracking  
✅ Secure JWT authentication  

## ⚙️ Configuration

**Backend API URL** (if different from default):
Edit `.env`:
```
REACT_APP_API_URL=http://your-backend-url:5000/api
```

## 🐛 Common Issues

**Can't login?**
- Make sure backend is running on port 5000
- Check email/password

**Excel upload fails?**
- File must be .xlsx or .xls
- Max size: 5MB
- Don't modify Student ID column

**No students showing?**
- Add students first in Students page
- Refresh page

## 📞 Need Help?

Check the full README.md for detailed documentation.

---

**Happy Certifying! 🎓**
