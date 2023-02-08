############ Docker file 
# Start with '18.14.0' version of NodeJs. This is the latest version of NodeJs as of 02/08/2023
FROM node:18.14.0

# We will test the project in development environment
ENV NODE_ENV=development

# The work directory will be '/Coursework_1/App'
WORKDIR /Coursework_1/App

# Copying all information from 'package.json' and 'package-lock.json' to the container
COPY package*.json ./

# Run the command 'npm install' to install all the needed packages needed from 'package.json' in the container 
RUN npm install

# Listenning on port 8000
EXPOSE 8000 

# Specify the commands to run the image
CMD ["node", "server.js"]
