### Node-API-Docker

Simple Restful Api with Node.js

### Technologies
- Node.js
   - Express.js
   - Knex.js
   - JWT / Passport
   - Consign
- Postgres
- Docker
   - Dockerfile
   - docker-compose
- Jest
   - supertest
- Nginx


### Diagram

![diagram](https://user-images.githubusercontent.com/12651865/157768699-5c12a4d7-c552-4b9b-b8fd-8795f38cf9f5.jpg)

### Commands
- Create and execute all **containers**. Port: **80** (nginx)

	`$ docker-compose up`

- Run **api** locally. Port: **3000** (node)

	`$ cd app`
	`$ npm start`

- Run **tests** locally

	`$ cd app`
	`$ npm test`

- Run **load_test**. Depends on running all containers

	`$ cd load_test`
	`$ npm start`
