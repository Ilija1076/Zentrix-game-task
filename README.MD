# Zentrix lab project

This project is a modular API system for a game-like environment, split into distinct microservices:
- **Account Service**: Handles user registration and authentication
- **Character Service**: Manages game characters, their classes, and items
- **Combat Service**: Handles PvP combat logic (challenges, duels, actions)

Each service is built with Node.js, Express, and TypeORM, and communicates via HTTP (REST API). Redis is used for caching and cooldowns.

## Project Structure

```
/account-service      # User registration, authentication (JWT), and roles
/character-service    # Characters, classes, items
/combat-service       # PvP challenges, combat actions, duel logic
zentriApiCollection.postman_collection.json      # (Optional) Postman collection(s) for API testing
README.md
docker-compose.yml
```


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= v16)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) 

---
## Docker Compose Setup

The recommended way to run all services and dependencies is via Docker Compose.

### **How to Start All Services**

**Build and start all containers:**
    ```sh
    docker-compose up --build
    ```
- **Access points:**  
  - Account Service: [http://localhost:3001](http://localhost:3001)
  - Character Service: [http://localhost:3002](http://localhost:3002)
  - Combat Service: [http://localhost:3003](http://localhost:3003)

