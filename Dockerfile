# Using Node:10 Image Since it contains all 
# the necessary build tools required for dependencies with native build (node-gyp, python, gcc, g++, make)
# First Stage : to install and build dependences

# FROM node:alpine as builder TODO invistigate error:0308010C:digital envelope routines::unsupported
FROM node:14 as builder

COPY . /app/

WORKDIR /app
RUN yarn
# RUN yarn validate
# TODO Check syntax
RUN yarn run build-react-app

FROM nginx:latest
ENV PORT=8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/build /var/www/dist
