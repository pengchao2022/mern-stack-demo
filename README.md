# Mern-stack-demo
devops demo

In this demo, I will write a  mern stack web-app from the very beginning.

## MERN Definition

- M stands for MongoDB

  - A NoSQL, document-oriented database that uses JSON-like documents with optional schemas.

- E stands for Express.js

  - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- R stands for React

  - A JavaScript library for building user interfaces, particularly single-page applications with reusable UI components.

- N stands for Node.js
  
  - A JavaScript runtime environment that executes JavaScript code outside a web browser, enabling server-side development.

## MERN architecture

![mern](./mern.png)

## Usage
- Initialize a Node JS applicaton
```shell
npm init -y
```
- Install express
```shell
npm install express@4.18.2
```
- Create server.js file
```shell
touch server.js
```
- Run the server
```shell
node server.js
```
- If you want to run dev like "npm run dev", you need to modify the package.json file 
from 
```shell
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ```
  to
  ```
  "scripts": {
    "dev": "nodemon server.js"
  },
  ```
- Remember that package.json file is in Backend folder, so you should go to backend directory to do that

- Install nodemon so that the server can refresh automatically
```shell
npm install nodemon -D
```
- then you also need to modify the package.json scripts and changed to nodemon
```shell
"scripts": {
    "dev": "nodemon server.js"
  },
```
- you can see the server now is running using nodemon
```shell
pengchaoma@pengchaos-MacBook-Pro backend % npm run dev

> backend@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
Server is running on port 5001
```
- Add the start command in package.json scripts
```shell
"scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
```
- Install mongodb using docker-compose
```shell
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
      MONGO_INITDB_DATABASE: mydatabase
    volumes:
      - ./mongodb/data:/data/db
      - ./mongodb/init:/docker-entrypoint-initdb.d  # initialization script directory
      - ./mongodb/config:/data/configdb
    # Enable authentication (recommended for production environments)
    command: ["--auth"]
```
- Run the docker-compose command
```shell
docker-compose up -d
```
- Install mongoose
```shell
npm install mongoose@7.0.3
```
- Install dotenv in backent directory
```shell
npm install dotenv
```
- Connect mongodb using docker-compose
```shell
docker-compose exec mongodb mongosh
```
- type the authentication information
  - switch to admin database for auth
  ```shell
    use admin
  ```
 - credential verification
   ```shell
   db.auth("admin", "secret")
   ```
 - when result return 1 that means successfully login
   like this
   ```shell
   admin> db.auth("admin", "secret")
    { ok: 1 }
   ```
- check the databases in mongodb
  ```shell
  admin> show dbs
  admin   100.00 KiB
  config   12.00 KiB
  local    72.00 KiB
  ```
- Use postman to have a test for example test the create post function

  ![post_test](./post_test.png)

- Go to mongodb to check the data
  ```shell
  admin> show dbs
  admin       100.00 KiB
  config      108.00 KiB
  local        64.00 KiB
  mydatabase   40.00 KiB 
  ```
- Switch to mydatabase
  ```shell
  use mydatabase
  ```
- Check the collection
  ```shell
  mydatabase> show collections
  notes
  ```
- Check all the Documents in notes collection
  ```shell
  db.notes.find()
  ```
  - then you can find all the documents like this
  ```shell
  [
  {
    _id: ObjectId('6963a123d9d605fd0fddb1f6'),
    title: 'what a beautiful day',
    content: 'Today I have go to the library to learn some cpp programing language',
    createdAt: ISODate('2026-01-11T13:09:55.334Z'),
    updatedAt: ISODate('2026-01-11T13:09:55.334Z'),
    __v: 0
  }
  ]
  ```
  










