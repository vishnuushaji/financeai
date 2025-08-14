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

# Ensure api directory exists
mkdir -p api

# Build the API
echo "Building API..."
npm run build:api

# Verify the API file was created
if [ ! -f "api/index.js" ]; then
    echo "Error: api/index.js was not created!"
    exit 1
fi

echo "Build completed successfully!"

# List contents to verify
echo "Contents of api directory:"
ls -la api/

echo "Contents of dist directory:"
ls -la dist/