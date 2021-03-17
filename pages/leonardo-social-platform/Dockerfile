FROM 15.11.0-alpine3.10

WORKDIR /usr/src/next

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]