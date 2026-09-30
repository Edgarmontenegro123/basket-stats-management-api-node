# Basket Stats - Management API

Backend microservice responsible for authentication and application data management within the **Basket Stats** platform.

The service provides REST APIs for managing users, teams, players, seasons and games. It is built with **Node.js, Express and TypeScript**, using **PostgreSQL** as its database.

The Management API is one of the two backend services consumed by the Basket Stats frontend.

---

## Responsibilities

The Management API is responsible for:

- User registration and authentication.
- JWT token generation and validation.
- Role-based authorisation.
- Team management.
- Player management.
- Season management.
- Game management.
- Game result updates.
- PostgreSQL data persistence.
- Communication with the Analytics API when related statistics need to be removed.

---

## Architecture

The service follows a modular REST API structure based on routes, handlers, middleware and database access.

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌──────────────────────┐
                    │   Management API     │
                    │ Node.js + Express    │
                    │     TypeScript       │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌──────────────────┐       ┌──────────────────┐
        │    PostgreSQL    │       │   Analytics API  │
        │                  │       │                  │
        │ Users            │       │ Related stats    │
        │ Teams            │       │ cleanup          │
        │ Players          │       │                  │
        │ Seasons          │       └──────────────────┘
        │ Games            │
        └──────────────────┘
```
The application is organised into:

---

```text
src/
├── db/
├── handlers/
├── middleware/
├── models/
├── routes/
├── index.ts
└── server.ts
```

## Main layers

- Routes — define HTTP endpoints and access rules.
- Handlers — implement application logic and database operations.
- Middleware — authentication and role-based authorisation.
- Database — PostgreSQL connection and schema.
- Models — TypeScript data structures.

---

## Main Features

### Authentication

The API provides:

- User registration.
- User login.
- Password hashing with `bcrypt`.
- JWT generation.
- JWT validation through authentication middleware.
- Role-based access control.

New users registered through the API receive the player role by default.

### Teams

The API supports:

- Listing teams.
- Retrieving a team by ID.
- Creating teams.
- Updating teams.
- Deleting teams.

Teams cannot be deleted while they have linked players, seasons or games.

### Players

The API supports:

- Listing players.
- Retrieving a player by ID.
- Listing players by team.
- Creating players.
- Updating players.
- Deleting players.

Player input includes information such as name, shirt number, position, physical data, date of birth and photo URL.

### Seasons

The API supports:

- Listing seasons.
- Retrieving a season by ID.
- Creating seasons.
- Updating seasons.
- Deleting seasons.

### Games

The API supports:

- Listing games.
- Retrieving a game by ID.
- Creating games.
- Updating games.
- Updating game results.
- Deleting games.

Games contain information such as participating teams, season, date, location, scores, status, friendly-match status and an optional video URL.

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Authenticate a user |

### Teams

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/teams` | Public | List teams |
| `GET` | `/teams/:id` | Public | Get a team |
| `POST` | `/teams` | Admin / Coach | Create a team |
| `PUT` | `/teams/:id` | Admin / Coach | Update a team |
| `DELETE` | `/teams/:id` | Admin / Coach | Delete a team |

### Players

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/players` | Public | List players |
| `GET` | `/players/:id` | Public | Get a player |
| `GET` | `/teams/:teamId/players` | Public | List players by team |
| `POST` | `/players` | Admin / Coach | Create a player |
| `PUT` | `/players/:id` | Admin / Coach | Update a player |
| `DELETE` | `/players/:id` | Admin / Coach | Delete a player |

### Seasons

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/seasons` | Public | List seasons |
| `GET` | `/seasons/:id` | Public | Get a season |
| `POST` | `/seasons` | Admin | Create a season |
| `PUT` | `/seasons/:id` | Admin | Update a season |
| `DELETE` | `/seasons/:id` | Admin | Delete a season |

### Games

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/games` | Public | List games |
| `GET` | `/games/:id` | Public | Get a game |
| `POST` | `/games` | Admin | Create a game |
| `PUT` | `/games/:id` | Admin | Update a game |
| `PATCH` | `/games/:id/result` | Admin / Coach / DT / Service | Update game result |
| `DELETE` | `/games/:id` | Admin | Delete a game |

### Service Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | API health check |
| `GET` | `/auth-check` | Authenticated | Verify authentication |

---

## Authentication and Authorisation

Protected endpoints use a JWT supplied through the Authorization header:

```http
Authorization: Bearer <token>
```
Authentication is handled by:

```text
src/middleware/authMiddleware.ts
```

Role-based access is handled by:

```text
src/middleware/authoriseRoles.ts
```

The API supports the following roles:

- admin
- coach
- dt
- player
- service

Access to protected operations is defined at route level using the authoriseRoles middleware.

---

## Database

The Management API uses PostgreSQL through the pg package.

The current database contains the following main entities:

```text
users
teams
players
seasons
games
```

The main relationships include:

```text
Team
├── Players
├── Seasons
└── Games

Season
└── Games

Game
├── Home Team
└── Away Team
```

Database access is configured through:

```text
src/db/pool.ts
```

---

## Technologies

- `Node.js`
- `Express`
- `TypeScript`
- `PostgreSQL`
- `pg`
- `JSON Web Tokens`
- `bcrypt`
- `CORS`
- `dotenv`

---

## Environment Variables

The API requires the following environment variables:

```dotenv
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
ANALYTICS_API_URL=
PORT=
```

`DATABASE_URL` is used to establish the PostgreSQL connection.

`JWT_SECRET` is used to sign and validate authentication tokens.

`FRONTEND_URL` defines the authorised frontend origin for CORS.

`ANALYTICS_API_URL` is used when related analytics data must be removed.

`PORT` defines the port used by the API. The default development port is 3001.

---

## Installation

Install the project dependencies:

```bash
npm install
```

Configure the required environment variables in a .env file.

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```
---

## Deployment

The Management API is currently deployed on an **Oracle Cloud VPS**.

### VPS Infrastructure

| Property | Value |
| --- | --- |
| Provider | Oracle Cloud |
| Region | São Paulo |
| Operating System | Ubuntu 24.04 |
| Instance Shape | VM.Standard.E2.1.Micro |
| OCPU | 1 |
| Memory | 1 GB |

The Management API runs as part of the Basket Stats backend infrastructure alongside the Analytics API.

---

## Related Services

Basket Stats consists of three independent repositories:

| Repository | Responsibility |
| --- | --- |
| Frontend | User interface and interaction |
| Management API | Authentication and application data management |
| Analytics API | Statistics processing and analytics |

The Management API provides the application data consumed by the frontend and works alongside the Analytics API to maintain consistency between management data and statistical data.

---

## Author

**Edgar Montenegro**