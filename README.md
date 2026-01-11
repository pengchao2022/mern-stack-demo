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






