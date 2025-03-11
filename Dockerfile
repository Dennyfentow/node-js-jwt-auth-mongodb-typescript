FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Construir o aplicativo TypeScript
RUN npm run build

EXPOSE 3000

# Usar a versão compilada
CMD ["node", "dist/server.js"] 