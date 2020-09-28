FROM reg.hydevops.com/base_images/node:14.4-alpine3.12

WORKDIR  /app

COPY ./dist ./
COPY ./node_modules ./node_modules


RUN true \
    && npm config set registry  http://nexus.hydevops.com/repository/npm-hy-frontend-group/ \
    && npm install -g pm2 

EXPOSE 3000

CMD ["pm2-runtime","./main.js"]
