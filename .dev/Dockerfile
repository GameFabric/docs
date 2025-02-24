FROM node:22-alpine
RUN corepack enable yarn && yarn -v

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/root/.local/bin

COPY . /docs
WORKDIR /docs
VOLUME /docs

RUN --mount=type=cache,target=/.yarn/cache yarn install --immutable

EXPOSE 5137
CMD ["yarn", "docs:dev"]