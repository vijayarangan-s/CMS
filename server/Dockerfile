FROM node:16-alpine3.14
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install -g npm@8.5.2
COPY . .
EXPOSE 4300
CMD ["npm", "start"]