FROM node:10

WORKDIR /user/src/user

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 4001

CMD npm run dev