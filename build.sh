#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the client (Vite)
echo "Building client..."
npm run build:client

# Verify the API file exists (it should already be there as .js)
if [ ! -f "api/index.js" ]; then
    echo "Error: api/index.js does not exist!"
    exit 1
fi

echo "Build completed successfully!"

# List contents to verify
echo "Contents of api directory:"
ls -la api/

echo "Contents of dist directory:"
ls -la dist/