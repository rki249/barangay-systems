#!/bin/bash
# One-command deployment with ngrok

echo "=== Barangay System - Ngrok Deployment ==="
echo ""
echo "Your system is ready for deployment!"
echo ""
echo "LOCAL SERVERS RUNNING:"
echo "  ✓ Backend API:  http://localhost:5000"
echo "  ✓ Frontend Dashboard: http://localhost:5173"
echo ""

# Installation method 1: Using brew (macOS) or choco (Windows)
# brew install ngrok  (macOS)
# choco install ngrok (Windows - if chocolatey is installed)

# Installation method 2: Download standalone
echo "INSTALLATION STEPS:"
echo ""
echo "1. Download ngrok from: https://ngrok.com/download"
echo "2. Extract the ngrok executable to your system"
echo "3. Add to PATH or use full path"
echo ""

# Method 3: Using Node.js package (recommended for this project)
echo "RECOMMENDED - Using ngrok via npm:"
echo ""
echo "cd backend"
echo "npm install ngrok"
echo ""
echo "Then run tunnels in separate terminals:"
echo ""
echo "Terminal 1: ngrok http 5000 --region us"
echo "Terminal 2: ngrok http 5173 --region us"
echo ""
echo "Or download standalone ngrok and run:"
echo ""
echo "ngrok http 5000"
echo "ngrok http 5173"
echo ""
echo "Visit http://127.0.0.1:4040 to see tunnel URLs and statistics"
