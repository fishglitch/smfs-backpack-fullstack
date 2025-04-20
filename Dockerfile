FROM node:23-alpine

ADD . /app

WORKDIR /app
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start:dev", "--", "--host", "0.0.0.0"]
