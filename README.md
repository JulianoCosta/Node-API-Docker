### Node-API-Docker

Simple Restful Api with Node.js

### Technologies

-  Node.js
   -  Express.js
   -  Knex.js
   -  JWT / Passport
   -  Consign
-  Postgres
-  Docker
   -  Dockerfile
   -  docker-compose
-  Jest
   -  supertest
-  Nginx

### Diagram

![diagram](https://user-images.githubusercontent.com/12651865/157768699-5c12a4d7-c552-4b9b-b8fd-8795f38cf9f5.jpg)

### Commands

-  Create and **execute all containers** on port **80** (nginx), on root folder:

   `$ docker-compose up`

   `$ docker-compose down` (to stop and delete the containers)

-  Run **api** locally on port **3000** (node):

   `$ cd app`

   `$ npm start`

-  Run **tests** locally:

   `$ cd app`

   `$ npm test`

-  Run **load_test**:

   -  Initialize the containers:

      `$ docker-compose up -d` (root folder, -d run in background)

   -  Initialize the load test:

      `$ cd load_test`

      `$ npm start`

   -  And in another terminal, launch real-time monitoring:

      `$ docker stats`
