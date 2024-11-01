FROM node:22-alpine

# Set working directory
WORKDIR /app

COPY solidity/package*.json ./

# Install the project dependencies
RUN npm install

#COPY shared/ ../shared/
COPY solidity/ ./

CMD ["cat", "/shared/constants/env.js"]