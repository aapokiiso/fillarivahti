FROM node:16

WORKDIR /usr/app

COPY . .

RUN npm ci
RUN npm run build

CMD [ "npm", "run", "start" ]
