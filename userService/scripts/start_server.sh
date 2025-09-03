#!/bin/bash
# This script starts the application using PM2.

# Ensure PM2 is installed globally
if ! command -v pm2 &> /dev/null
then
    echo "PM2 not found. Installing PM2..."
    sudo npm install -g pm2
fi

# Navigate to the application directory
cd /home/ubuntu/closetobuy_user_service/ || exit

# Check if the application is already running
if pm2 list | grep -q 'user'; then
    echo "Application 'user' is already running. Restarting..."
    pm2 restart user
else
    echo "Starting application 'user'..."
    pm2 start ./build/index.js --name user
fi
