# Social app
A small social media application for posting messages and voting on them.

## Technologies used
- React
- Next.js
- Mongodb with mongoose
- Magic.link (for login)
- Typescript
- Iron (by Hapi) for cookie encryption
- Docker

## Running the code
First, you need to set up your local variables

- Clone the code
- Copy `data.example` to `data`
- Copy `initMongo.example.js` to `initMongo.js`
- Put the mongodb username and password into `initMongo.js`
- Put the mongodb username and password into `data/mongodbAuth/user` and `data/mongodbAuth/pwd` 
- Run `docker-compose -f ./docker-compose.dev.yml up --build --remove-orphans` to run the dev
- Copy `pages/leonardo-social-platform/.env.example` to `pages/leonardo-social-platform/.env` and fill in the environmental variables. Get the `MAGIC_` keys from the [magic website](https://magic.link/). `ENCRYPTION_SECRET` needs to be a random string of characters.
- Use `npm i` to install the other dependencies

After that, run `# docker-compose -f ./docker-compose.dev.yml up --build --remove-orphans`.
