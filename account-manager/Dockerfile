# Use a Node.js base image
FROM node:latest

# Set working directory
WORKDIR /account-manager

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install prisma globally
RUN npm install -g prisma

# Generate Prisma client
RUN prisma generate

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
