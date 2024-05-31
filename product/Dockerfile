FROM node

WORKDIR /app/product

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]