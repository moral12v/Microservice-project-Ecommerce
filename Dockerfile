# Stage 1: The Build Stage (using a specific, stable version)
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifest files first
# This ensures Docker can use a cache layer for 'npm install'
# unless package.json or package-lock.json changes.
COPY package.json package-lock.json ./

# Install dependencies. We use 'npm ci' for clean, reproducible installs 
# based exactly on package-lock.json.
RUN npm install

# Copy the rest of your application code
COPY . .

# Stage 2: The Final Stage (optional, but better for production)
# This uses a smaller runtime image to reduce the final image size.
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy installed dependencies and built app from the 'build' stage
COPY --from=build /app .

# Port your application listens on (e.g., Express default)
# **CHANGE THIS if your app runs on a different port (like 8080 or 4000)**
EXPOSE 3000

# Command to start your application (should match the "start" script in your package.json)
CMD ["npm", "start"]
