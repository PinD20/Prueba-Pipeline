FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Definir las variables de entorno en el contenedor
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}
ENV DB_NAME=${DB_NAME}
ENV DB_PORT=${DB_PORT}
ENV API_PORT=${API_PORT}
ENV SECRET_KEY=${SECRET_KEY}

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]