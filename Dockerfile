FROM node:18
WORKDIR /usr/src/app
COPY --chown=node package*.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV 'production'
CMD npm run test && npm run start:prod
