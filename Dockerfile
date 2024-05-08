# Use a base image with Node.js
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for both backend and frontend
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Install dependencies for both backend and frontend
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy the full project files
COPY . .

# Run database update script
RUN cd backend && npm run updatedb

# Install 'concurrently' to run both frontend & backend together
RUN npm install -g concurrently

# Expose the ports used by backend and frontend
EXPOSE 3000 5173

# Start both backend and frontend together
CMD concurrently --kill-others-on-fail \
    "cd backend && npm run startdev" \
    "cd frontend && npm run dev -- --host"
