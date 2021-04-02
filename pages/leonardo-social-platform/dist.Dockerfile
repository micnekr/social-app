# docker build . -f dist.Dockerfile -t leonardo2021/dist_app
# docker run --rm -p 3000:3000 leonardo2021/dist_app 
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

RUN addgroup -S nextjsGroup 
RUN adduser -S nextjs -G nextjsGroup
# make sure that the directory itself is owned by us
RUN chown nextjs:nextjsGroup ./
USER nextjs

# copy the names of dependancies and install them
COPY --chown=nextjs:nextjsGroup package*.json ./
RUN npm install

# copy source
COPY --chown=nextjs:nextjsGroup . .

EXPOSE 3000

ENV NODE_ENV production

RUN npm run build

CMD /wait && npm run start
