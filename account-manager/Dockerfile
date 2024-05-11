# Use a Node.js base image
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Run prisma generate
RUN cd account-manager && prisma generate

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
