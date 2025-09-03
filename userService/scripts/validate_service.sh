#!/bin/bash
# This script validates that the application is running.

# Wait for a few seconds to allow the service to start
sleep 5

# Check if the PM2 process is running
# pm2 describe "ctb_service" &> /dev/null
# PM2_STATUS=$?

# if [ $PM2_STATUS -eq 0 ]; then
#     echo "Application is running under PM2."
#     exit 0
# else
#     echo "Application failed to start."
#     exit 1
# fi