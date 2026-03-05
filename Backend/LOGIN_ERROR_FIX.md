# Login Error Fix - Diagnostic & Solution Guide

## 🔴 Error: `POST http://localhost:5000/api/auth/login 404 (Not Found)`

This means the backend server is reachable but the login route is not found.

---

## ✅ Solution: Restart Backend with Better Logging

### Step 1: Stop Current Backend
If the backend is still running, stop it:
```bash
# If you're in the terminal running backend, press: Ctrl + C
```

### Step 2: Clean Start Backend
```bash
cd D:\Eco Cycle\Backend
npm start
```

You should see output like:
```
🔄 Connecting to database...
✅ Database connected
✅ Uploads folder created
🚀 Server running on port 5000
📝 Health check: http://localhost:5000/api/health
🔓 Login endpoint: POST http://localhost:5000/api/auth/login
```

### Step 3: Test Backend is Running
Open a new terminal and run:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running ✅","timestamp":"2026-03-05T..."}
```

If this works, your backend is running correctly ✅

---

## 🧪 Test Login Endpoint (Using cURL)

### Step 1: Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@ecocycle.com\",\"password\":\"Admin@123\"}"
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@ecocycle.com",
    "usertype": "Admin"
  }
}
```

### Step 2: Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"Password@123\"}"
```

If the endpoint works with cURL, the issue is likely with your frontend setup.

---

## 🔍 Troubleshooting Checklist

### Backend Issues:

- [ ] **Backend is running on port 5000**
  - Test: `curl http://localhost:5000/api/health`
  - Should return: `{"status":"Server is running ✅"...}`

- [ ] **Database is connected**
  - Look for: `✅ Database connected` in terminal output
  - If not, check `.env` file settings

- [ ] **Routes are registered**
  - Look for: `🔓 Login endpoint: POST http://localhost:5000/api/auth/login`

- [ ] **Admin account exists**
  - Run: `node init-db.js` to ensure admin is created
  - Email: `admin@ecocycle.com`, Password: `Admin@123`

### Frontend Issues:

- [ ] **Frontend is running on correct port (5173)**
  - URL should be: `http://localhost:5173`

- [ ] **API base URL is correct**
  - File: `Frontend/api/axios.jsx`
  - Should have: `baseURL: "http://localhost:5000/api"`

- [ ] **No CORS issues**
  - Backend should show CORS enabled for `localhost:5173`

---

## 🚀 Complete Restart Procedure

### Terminal 1 - Backend:
```bash
cd D:\Eco Cycle\Backend
npm start
```

Expected: ✅ `🚀 Server running on port 5000`

### Terminal 2 - Initialize Database:
```bash
cd D:\Eco Cycle\Backend
node init-db.js
```

Expected: ✅ `✅ Database setup complete!`

### Terminal 3 - Frontend:
```bash
cd D:\Eco Cycle\Frontend
npm run dev
```

Expected: ✅ Local: `http://localhost:5173/`

### Terminal 4 - Test Health Check:
```bash
curl http://localhost:5000/api/health
```

Expected: ✅ `{"status":"Server is running ✅"...}`

---

## 📊 Expected Port Setup

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Backend | 5000 | http://localhost:5000 | Must be running ✅ |
| Frontend | 5173 | http://localhost:5173 | Must be running ✅ |
| Database | 5432 | PostgreSQL | Must be running ✅ |

All three must be running for login to work!

---

## 🔐 Login Credentials

### Admin:
```
📧 Email: admin@ecocycle.com
🔒 Password: Admin@123
```

### Test User (if you created one):
```
📧 Email: user@example.com
🔒 Password: (whatever was set during signup)
```

---

## 💡 If Still Getting 404 Error

### Try This:

1. **Verify Backend is Listening**
   ```bash
   netstat -ano | findstr :5000
   ```
   Should show a process listening on port 5000

2. **Check for Port Conflicts**
   - Is something else using port 5000?
   - Change PORT in `Backend/server.js` if needed

3. **Clear npm Cache**
   ```bash
   cd Backend
   npm cache clean --force
   npm install
   npm start
   ```

4. **Check Database Connection**
   - Verify PostgreSQL is running
   - Check credentials in `.env` file
   - Test: `psql -U [user] -d eco_cycle`

5. **Restart Everything**
   - Close all terminals
   - Close VS Code
   - Reopen and start fresh

---

## 🔧 Backend Improvements Made

✅ Better error logging in server startup
✅ Health check endpoint (`/api/health`) 
✅ Detailed startup messages
✅ 404 handler showing requested paths
✅ Better middleware ordering

---

## ✨ After Fix - Test These

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Admin Login
Go to: `http://localhost:5173/admin-login`
- Email: `admin@ecocycle.com`
- Password: `Admin@123`

### 3. User Login
Go to: `http://localhost:5173/login`
- Use your registered user credentials

### 4. Dashboard
Go to: `http://localhost:5173/dashboard`
- Should load without errors

---

## 📝 Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Backend not running or route missing | Start backend: `npm start` |
| ECONNREFUSED | Backend not listening on port 5000 | Check port in server.js |
| 500 Internal Server | Database connection failed | Check .env settings |
| CORS error | Frontend is not in allowed origins | Check CORS config in server.js |
| Invalid credentials | Wrong email/password | Use: `admin@ecocycle.com` / `Admin@123` |

---

## 🎯 Next Steps

1. ✅ Stop current backend (Ctrl+C)
2. ✅ Run fresh start: `npm start` in Backend folder
3. ✅ Verify: `curl http://localhost:5000/api/health`
4. ✅ Ensure frontend is running on 5173
5. ✅ Try login at `http://localhost:5173/admin-login`

---

## 📞 Still Having Issues?

1. Check browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify all three services are running:
   - Backend (5000)
   - Frontend (5173)
   - Database (PostgreSQL)
4. Try the health check endpoint
5. Test with cURL commands above

---

**Your backend is now properly configured with diagnostic endpoints!** 🎉
