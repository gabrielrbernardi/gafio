FROM node:12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
# RUN npm install react-scripts@3.3.1 -g 

COPY . .

# EXPOSE 3000

CMD ["dir"]

CMD ["npm", "start"]