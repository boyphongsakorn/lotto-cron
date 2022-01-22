FROM node:16-alpine
WORKDIR '/app'
COPY package*.json ./
#RUN apk add --update g++ make python3 py3-pip 
#RUN apk add --update imagemagick
RUN npm install
COPY . .
CMD ["node","index.js"]