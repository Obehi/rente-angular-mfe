FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
LABEL intermidiate=true
COPY . .
RUN npm install
RUN npm run build:local
### STAGE 2: Run ###
FROM nginx:1.19.0
COPY --from=build /usr/src/app/dist/rente-front-end /usr/share/nginx/html
