FROM node:10.16.0-alpine
COPY app/bin /app/bin
COPY app/components /app/components
COPY app/public /app/public
COPY app/routes /app/routes
COPY app/views /app/views
COPY app/app.js /app/app.js
COPY app/app.js /app/app.js
COPY app/package.json /app/package.json
COPY app/yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]