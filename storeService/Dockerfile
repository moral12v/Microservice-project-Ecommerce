FROM node:20.12.1

ENV NODE_ENV $NODE_ENV
ENV PORT=8505
ENV HOST=0.0.0.0
ENV MONGODB_HOST=localhost
ENV MONGODB_PORT=27017
ENV MONGODB_DATABASE=store_service
ENV SOCKET_SERVER_URL=http://0.0.0.0:8501
ENV KAFKA_CLIENT_ID=STORE-SERVICE-CLIENT
ENV KAFKA_BROKER_PORT=9095
ENV API_SECRET=hjgsdjbsdjmdfnsklfsmlf4uy5uhbhfgujer
ENV REFRESH_TOKEN_SECRET=hjgsdjbsdjmdfnsklfsmlf4uy5uhbhfgujer

WORKDIR /usr/src/app


COPY package.json yarn.lock ./
RUN yarn install --production


COPY . .

EXPOSE 8503


CMD if [ "$NODE_ENV" = "production" ]; \
    then yarn build && yarn start; \
    else yarn dev; \
    fi
