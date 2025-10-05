# authService/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy service-specific package files
# (Assuming package-lock.json exists inside authService now)
COPY package.json ./

# Install dependencies and build the code
RUN npm install 
RUN npm run build 

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
