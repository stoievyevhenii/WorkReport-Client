FROM node:18-alpine

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 alpine-sdk && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


ENTRYPOINT ["npm", "run","start"]
