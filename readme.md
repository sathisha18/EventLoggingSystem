## Tech stack used ReactJs, NodeJs, Joi, Mongodb, Zod, Shadcn, Docker, Nginx
## Folder structure

#### 1. client -> Contains frontend code

#### 2. server -> Contains backend code

#### 3. docker -> Contains docker compose file to run the backend server with multiple replicas for horizontal scaling

#### 4. nginx -> Contains nginx configuration file for load balancing

## How to run the project

#### 1. Firstly create a .env file in server folder 
```
PORT = 3000
MONGO_URI="MongoDB url"
```

#### 2. Run the docker compose file to run the backend server with multiple replicas for horizontal scaling

```
cd docker

docker compose up --build  // If you want logs

docker compose up --build -d // To run in detach mode so that it will run in background and free up the terminal
```

#### 2. To run the frontend

```
cd client
npm run dev
```
