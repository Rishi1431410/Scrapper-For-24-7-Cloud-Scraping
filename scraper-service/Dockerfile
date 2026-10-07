# Lightweight Node.js 20 Alpine Image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV MUMBAI_PINCODE=400001

# Expose port
EXPOSE 5000

# Start autonomous microservice
CMD ["node", "server.js"]
