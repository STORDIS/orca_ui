# Use Node.js as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /orca_ui

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy the entire project to the working directory,except the files skipped in .dockerignore
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start orca_ui
CMD npm start