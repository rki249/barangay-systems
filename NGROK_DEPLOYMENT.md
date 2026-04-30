# Barangay System - Ngrok Deployment Guide

## Current Deployment Status

### Local Servers (Running)
- **Backend API**: http://localhost:5000
- **Frontend Dashboard**: http://localhost:5173
- **Backend Database**: Connected to MySQL

### Deployment Methods

## Option 1: Download and Use Standalone Ngrok

```powershell
# Download ngrok directly
$url = "https://bin.equinox.io/a/cJk8dzafvmN/ngrok-v3-3.3.1-windows-amd64.zip"
$output = "$env:USERPROFILE\Downloads\ngrok.zip"
Invoke-WebRequest -Uri $url -OutFile $output
Expand-Archive -Path $output -DestinationPath "$env:USERPROFILE\AppData\Local\ngrok"

# Or use the ngrok command if already installed
ngrok http 5000 --name backend
# In another terminal:
ngrok http 5173 --name dashboard
```

## Option 2: Using Node.js ngrok Package

```bash
cd backend
npm install ngrok
node ngrok-deploy.js
```

## Option 3: Run Both Servers Together

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd dashboard
npm run dev
```

Terminal 3 (Ngrok Tunnels):
```bash
ngrok http 5000
ngrok http 5173
```

## API Configuration

After ngrok starts, update your frontend API calls to use the ngrok URL:

In `dashboard/src/` components, replace:
```javascript
const API_URL = "http://localhost:5000";
```

With:
```javascript
const API_URL = "{NGROK_BACKEND_URL}"; // e.g., https://xxxx-xx-xxx-xxx.ngrok.io
```

## Example Ngrok Output

```
Session Status: online
Account: YOUR_EMAIL@example.com
Update Available: v3.3.2

Version:      3.3.1
Region:       United States (us)
Web Interface: http://127.0.0.1:4040
Forwarding:   https://backend-ngrok.ngrok.io -> http://localhost:5000
Forwarding:   https://dashboard-ngrok.ngrok.io -> http://localhost:5173
```

## Performance Notes
- Free tier ngrok URLs are temporary and will change on restart
- Consider upgrading for persistent static URLs
- Maximum bandwidth on free tier

## Next Steps
1. Note the ngrok URLs from the tunnels
2. Share the frontend URL with users
3. Configure backend API endpoints with the ngrok URL
4. Test all API connections through the public URLs
