# base image
FROM node:14.15.0

# Settings arguments for angular app
#ARG PROJECT_DIR="angular_ap"
#ARG APP_NAME="example"


# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY ./package.json /app/package.json
RUN npm install
#RUN npm install -g @angular/cli@7.3.9
#RUN npm rebuild node-sass

# add app
COPY . /app
WORKDIR /app

# start app
CMD npm run build && npm run start
