#!/bin/bash

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "Homebrew is not installed. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Create MongoDB Data Directory
sudo mkdir -p /System/Volumes/Data/data/db

# Set Permissions for the Data Directory
sudo chown -R `id -un` /System/Volumes/Data/data/db

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Generate MongoDB Connection String
CONNECTION_STRING="mongodb://localhost:27017/mydatabase"

# Print Connection String
echo "MongoDB connection string: $CONNECTION_STRING"

# Optional: Stop MongoDB
# brew services stop mongodb/brew/mongodb-community
