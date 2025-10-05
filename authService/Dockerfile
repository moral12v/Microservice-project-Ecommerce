# authService/Dockerfile
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the service-specific package files from the current context (authService folder)
COPY package.json ./
# Note: package-lock.json is still missing, so we only copy package.json

# Install dependencies and build the code
RUN npm install
RUN npm run build 

# Copy the rest of the application code, including tsconfig.json and the source files
COPY . .

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
