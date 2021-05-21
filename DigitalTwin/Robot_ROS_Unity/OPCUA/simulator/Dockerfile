FROM node:12-alpine

COPY ./ /app/

WORKDIR /app

RUN apk add --update openssl && \
    rm -rf /var/cache/apk/* && \
    npm install

EXPOSE 49321

ENTRYPOINT ["npm", "start"]