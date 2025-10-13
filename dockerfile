# Use official Node.js 22 Alpine base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
