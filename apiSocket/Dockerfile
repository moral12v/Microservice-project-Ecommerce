
FROM node:20.12.1



ENV NODE_ENV $NODE_ENV
ENV PORT=8501
ENV HOST=0.0.0.0
ENV GATEWAY_REGISTER_API_URL=http://0.0.0.0:8500/register
ENV GATEWAY_REMOVE_API_URL=http://0.0.0.0:8500/remove


WORKDIR /usr/src/app


COPY package.json yarn.lock ./
RUN yarn install --production


COPY . .

EXPOSE 8501


CMD if [ "$NODE_ENV" = "production" ]; \
    then yarn build && yarn start; \
    else yarn dev; \
    fi

