FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Cloud Run environment variables
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Expose Cloud Run port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]