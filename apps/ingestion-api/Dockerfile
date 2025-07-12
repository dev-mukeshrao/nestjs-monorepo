# apps/ingestion-api/Dockerfile

# Base image
FROM node:20-alpine

# Set workdir
WORKDIR /app

# Copy package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build only this app
RUN npm run build ingestion-api

# Expose app port (change if needed)
EXPOSE 3000

# Run the app
CMD ["node", "dist/apps/ingestion-api/main.js"]
