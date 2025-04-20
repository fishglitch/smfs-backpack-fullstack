FROM node:23-alpine

ADD . /app

WORKDIR /app
RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
