# Barangay System - Ngrok Deployment Script

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Barangay System - Ngrok Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Setup ngrok directory
$ngrokDir = Join-Path $env:USERPROFILE "ngrok"
$ngrokExe = Join-Path $ngrokDir "ngrok.exe"

# Create directory if it doesn't exist
if (-not (Test-Path -Path $ngrokDir)) {
    New-Item -ItemType Directory -Path $ngrokDir -Force | Out-Null
    Write-Host "✓ Created ngrok directory" -ForegroundColor Green
}

# Download ngrok if not exists
if (-not (Test-Path -Path $ngrokExe)) {
    Write-Host "Downloading ngrok..." -ForegroundColor Yellow
    $url = "https://bin.equinox.io/a/cJk8dzafvmN/ngrok-v3-3.3.1-windows-amd64.zip"
    $zipPath = Join-Path $ngrokDir "ngrok.zip"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
        Write-Host "✓ Downloaded ngrok" -ForegroundColor Green
        
        Write-Host "Extracting ngrok..." -ForegroundColor Yellow
        Expand-Archive -Path $zipPath -DestinationPath $ngrokDir -Force
        Remove-Item -Path $zipPath -Force
        Write-Host "✓ Extracted ngrok" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to download ngrok: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "===== DEPLOYMENT STATUS =====" -ForegroundColor Green
Write-Host ""
Write-Host "LOCAL SERVERS:" -ForegroundColor Yellow
Write-Host "  Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Starting ngrok backend tunnel (port 5000)..." -ForegroundColor Cyan
Write-Host ""

# Start ngrok backend tunnel
Start-Process -FilePath $ngrokExe -ArgumentList "http 5000" -NoNewWindow

Write-Host "✓ Ngrok tunnel started" -ForegroundColor Green
Write-Host ""
Write-Host "=== NGROK DASHBOARD ===" -ForegroundColor Cyan
Write-Host "Visit: http://127.0.0.1:4040" -ForegroundColor White
Write-Host ""
Write-Host "Your public URLs will appear in the dashboard above." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in ngrok window to stop the tunnel." -ForegroundColor Yellow
