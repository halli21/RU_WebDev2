# Install Chocolatey (if not already installed)
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# Install MongoDB
choco install mongodb -y

# Create MongoDB Data Directory
mkdir -Force "C:\data\db"

# Start MongoDB
Start-Process "mongod" "--dbpath='C:\data\db'" -NoNewWindow -Wait

# Generate MongoDB Connection String
$MONGODB_PORT = "27017"
$CONNECTION_STRING = "mongodb://localhost:$MONGODB_PORT/mydatabase"

# Print Connection String
Write-Host "MongoDB connection string: $CONNECTION_STRING"

# Verify MongoDB Installation
Start-Process "mongo" -NoNewWindow
