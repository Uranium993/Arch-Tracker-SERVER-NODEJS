FROM node:alpine
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install && npm install -g nodemon && apt-get update && echo "root:Docker!"
CMD ["npm", "run", "server"]

