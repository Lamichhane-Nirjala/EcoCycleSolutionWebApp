# Login 404 Error - Step-by-Step Fix Guide

## 🔴 The Problem
```
POST http://localhost:5000/api/auth/login 404 (Not Found)
```

This means the backend server is not responding to the login request.

---

## ✅ Solution: 5-Minute Quick Fix

### Step 1: Stop Backend (if running)
- Look for the terminal running backend
- Press `Ctrl + C` to stop it
- Verify it stopped

### Step 2: Verify Node Modules Exist
Go to Backend folder and check:
```bash
cd D:\Eco Cycle\Backend
dir node_modules
```

If `node_modules` doesn't exist:
```bash
npm install
```

### Step 3: Clean Start Backend
```bash
npm start
```

**Wait for this exact output:**
```
🔄 Connecting to database...
✅ Database connected
✅ Uploads folder created
🚀 Server running on port 5000
📝 Health check: http://localhost:5000/api/health
🔓 Login endpoint: POST http://localhost:5000/api/auth/login
```

If you see ✅ on all lines, proceed to Step 4.

### Step 4: Test Health Check
Open **new terminal** (don't close the backend terminal) and run:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running ✅","timestamp":"..."}
```

✅ If you see this, your backend is working!

### Step 5: Try Login
1. Go to frontend: `http://localhost:5173/admin-login`
2. Enter:
   - Email: `admin@ecocycle.com`
   - Password: `Admin@123`
3. Click "Sign In"
4. Should redirect to dashboard ✅

---

## 🚀 Complete Clean Start (If Above Doesn't Work)

### Terminal 1 - Backend Start:
```bash
cd D:\Eco Cycle\Backend

# Clear cache and reinstall
npm cache clean --force
npm install

# Ensure database is initialized
node init-db.js

# Start the server
npm start
```

Wait for:
```
✅ Database connected
🚀 Server running on port 5000
```

### Terminal 2 - Frontend Start:
```bash
cd D:\Eco Cycle\Frontend
npm run dev
```

### Terminal 3 - Verify Working:
```bash
curl http://localhost:5000/api/health
```

Should return success ✅

---

## 🧪 Test Login with cURL (To Verify Endpoint)

If you want to test the endpoint directly without the frontend:

### Test Admin Login:
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@ecocycle.com\",\"password\":\"Admin@123\"}"
```

### Expected Response:
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

✅ If endpoint works with cURL, the issue is frontend-specific.

---

## 🔍 Error Diagnosis

### If Health Check Fails:

**Error**: `curl: (7) Failed to connect`
```
Solution: Backend is not running
- Check backend terminal for errors
- Ensure port 5000 is not blocked
- Try: npm start
```

**Error**: `Connection refused`
```
Solution: Port 5000 in use by another process
- Kill the process: taskkill /PID [PID] /F
- Or change PORT in server.js to 5001
```

**Error**: Database connection failed
```
Solution: PostgreSQL not running or .env incorrect
- Start PostgreSQL service
- Check .env: DB_HOST, DB_USER, DB_PASSWORD
- Run: node init-db.js
```

### If Health Check Works But Login Still 404:

**Check Frontend axios config:**
```javascript
// File: Frontend/api/axios.jsx
const api = axios.create({
  baseURL: "http://localhost:5000/api"  // ← Should be this
});
```

**Check Backend Routes:**
```javascript
// File: Backend/Router/userRouter.js
router.post("/login", loginUser);  // ← Must exist
```

**Check Main Router:**
```javascript
// File: Backend/server.js
app.use("/api/auth", userRouter);  // ← Must exist
```

---

## 📊 Verification Checklist

- [ ] Backend started with `npm start`
- [ ] Saw `✅ Database connected` message
- [ ] Saw `🚀 Server running on port 5000` message
- [ ] Health check returns JSON response
- [ ] Frontend is running on port 5173
- [ ] Can see admin login page
- [ ] Admin credentials are correct:
  - Email: `admin@ecocycle.com`
  - Password: `Admin@123`

---

## 🚨 Still Not Working? Try Nuclear Option

### Complete Reset:
```bash
# Terminal 1 - Check for running processes
tasklist | findstr node

# Kill any node processes
taskkill /F /IM node.exe

# Terminal 2 - Backend clean install
cd D:\Eco Cycle\Backend
rmdir /s /q node_modules
npm install
npm start

# Terminal 3 - Frontend clean install  
cd D:\Eco Cycle\Frontend
rmdir /s /q node_modules
npm install
npm run dev

# Terminal 4 - Verify
curl http://localhost:5000/api/health
```

---

## 📝 Key Files & Paths

| File | Path | Purpose |
|------|------|---------|
| Core Server | `Backend/server.js` | Main server config |
| Auth Router | `Backend/Router/userRouter.js` | Login routes |
| Login Controller | `Backend/Controller/userController.js` | Login logic |
| Frontend Login | `Frontend/src/Pages/Login.jsx` | UI login form |
| API Config | `Frontend/api/axios.jsx` | API base URL |
| Init Database | `Backend/init-db.js` | Create admin user |

---

## ✨ After Fix

Once login works:

1. ✅ Go to `/admin-login` - Admin panel login
2. ✅ Use credentials:
   - Email: `admin@ecocycle.com`
   - Password: `Admin@123`
3. ✅ Access admin dashboard
4. ✅ Manage users and system

---

## 💡 Common Mistakes

❌ **Not restarting backend after code changes**
✅ Solution: Always `npm start` after changes

❌ **Using wrong port numbers**
✅ Backend: 5000, Frontend: 5173, Database: 5432

❌ **Forgetting to initialize database**
✅ Run: `node init-db.js`

❌ **node_modules not installed**
✅ Run: `npm install` in Backend folder

❌ **Wrong admin credentials**
✅ Email: `admin@ecocycle.com`, Password: `Admin@123`

---

## 🆘 If All Else Fails

Contact with this info:
1. Output from `npm start` command
2. Output from health check test
3. Browser console error (F12)
4. Backend terminal error messages
5. Result of `curl http://localhost:5000/api/health`

---

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ Health check returns JSON
- ✅ Browser shows admin login form
- ✅ Can enter credentials
- ✅ No 404 error in console
- ✅ Redirects to dashboard after login
- ✅ Admin page loads with data

---

**You got this! Follow the steps above and your login will work! 🎉**
