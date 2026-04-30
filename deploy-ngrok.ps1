$ErrorActionPreference = "Stop"

Write-Host "=== Ngrok Deployment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Create ngrok directory
$ngrokDir = Join-Path $env:USERPROFILE "AppData\Local\ngrok-deploy"
if (-not (Test-Path -Path $ngrokDir)) {
    New-Item -ItemType Directory -Path $ngrokDir -Force | Out-Null
    Write-Host "✓ Created ngrok directory: $ngrokDir" -ForegroundColor Green
}

# Download ngrok if not exists
$ngrokExe = Join-Path $ngrokDir "ngrok.exe"
if (-not (Test-Path $ngrokExe)) {
    Write-Host "Downloading ngrok..." -ForegroundColor Yellow
    $url = "https://bin.equinox.io/a/cJk8dzafvmN/ngrok-v3-3.3.1-windows-amd64.zip"
    $zipFile = Join-Path $ngrokDir "ngrok.zip"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipFile -UseBasicParsing
        Write-Host "✓ Downloaded ngrok" -ForegroundColor Green
        
        # Extract
        Write-Host "Extracting ngrok..." -ForegroundColor Yellow
        Expand-Archive -Path $zipFile -DestinationPath $ngrokDir -Force
        Remove-Item $zipFile -Force
        Write-Host "✓ Extracted ngrok" -ForegroundColor Green
    } catch {
        Write-Host "✗ Download failed: $_" -ForegroundColor Red
        exit 1
    }
}

# Start tunnels
Write-Host ""
Write-Host "Starting ngrok tunnels..." -ForegroundColor Cyan
Write-Host ""

# Backend tunnel
Write-Host "Opening backend tunnel (port 5000)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath $ngrokExe -ArgumentList "http 5000" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

# Frontend tunnel
Write-Host "Opening frontend tunnel (port 5173)..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath $ngrokExe -ArgumentList "http 5173" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== DEPLOYMENT URLS ===" -ForegroundColor Green
Write-Host "Check ngrok web interface at: http://127.0.0.1:4040" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servers running:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "✓ Deployment active! Press any key to stop..." -ForegroundColor Green
Read-Host

# Cleanup
Write-Host "Stopping ngrok tunnels..." -ForegroundColor Yellow
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
