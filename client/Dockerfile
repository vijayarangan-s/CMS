FROM node:16-alpine3.14
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5500
CMD ["npm","start"]