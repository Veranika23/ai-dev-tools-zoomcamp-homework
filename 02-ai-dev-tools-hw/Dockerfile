# Use official Node.js LTS image
FROM node:20

WORKDIR /app

# Copy backend and frontend package files first (for caching)
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
COPY package*.json ./

# Install root dependencies (if any)
RUN npm install

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Copy backend and frontend source code BEFORE building
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

# Install frontend dependencies and build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Move frontend build to backend's public directory
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "index.js"]