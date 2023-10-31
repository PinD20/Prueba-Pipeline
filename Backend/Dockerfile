FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Copiar las variables de entorno definidas en el workflow al entorno de ejecución del contenedor
ARG DB_HOST
ARG DB_USER
ARG DB_PASS
ARG DB_NAME
ARG DB_PORT
ARG API_PORT
ARG SECRET_KEY

# Definir las variables de entorno en el contenedor
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASS=$DB_PASS
ENV DB_NAME=$DB_NAME
ENV DB_PORT=$DB_PORT
ENV API_PORT=$API_PORT
ENV SECRET_KEY=$SECRET_KEY

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]