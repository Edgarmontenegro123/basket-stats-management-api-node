# 1. Imagen base de Node.js
FROM node:18-alpine

# 2. Directorio de trabajo
WORKDIR /app

# 3. Copiar manifest de dependencias
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del código
COPY . .

# 6. Compilar TypeScript
RUN npm run build

# 7. Exponer el puerto de la Management API
EXPOSE 3000

# 8. Comando de arranque (usando el código compilado en dist/build)
CMD ["npm", "start"]