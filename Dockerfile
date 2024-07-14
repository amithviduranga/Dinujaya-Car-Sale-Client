# Step 1: Build the React application
FROM node:20.14.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve the React application using 'serve'
FROM node:20.14.0

# Install 'serve' globally
RUN npm install -g serve

# Copy the build output to the server directory
COPY --from=build /app/build /usr/src/app

# Expose port 5000 to the outside world
EXPOSE 3000

# Start the React application using 'serve'
CMD ["serve", "-s", "/usr/src/app", "-l", "3000"]