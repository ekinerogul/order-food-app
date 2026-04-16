# Order Food App — Backend

REST API service built with Express.js and MongoDB.

## Live API

Backend is deployed on Google Cloud Run:

https://order-food-backend-443821973119.europe-west3.run.app

The production API uses MongoDB Atlas for database storage.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) — authentication
- bcryptjs — password hashing

## Setup

```bash
cd backend
npm install
npm start
```

Default port: `3000`

Requires `MONGODB_CONNECTION_STRING` environment variable for database connection. Automatically configured when using Docker Compose.

## API Endpoints

### Users

| Method | Endpoint                  | Description       | Auth |
| ------ | ------------------------- | ----------------- | ---- |
| POST   | `/users/register`         | Register new user | No   |
| POST   | `/users/login`            | User login        | No   |
| GET    | `/users/me`               | Get profile       | Yes  |
| PATCH  | `/users/me`               | Update name       | Yes  |
| PATCH  | `/users/me/email`         | Update email      | Yes  |
| PATCH  | `/users/me/password`      | Update password   | Yes  |
| DELETE | `/users/me`               | Delete account    | Yes  |
| POST   | `/users/me/addresses`     | Add address       | Yes  |
| PATCH  | `/users/me/addresses/:id` | Update address    | Yes  |
| DELETE | `/users/me/addresses/:id` | Remove address    | Yes  |

### Restaurants

| Method | Endpoint                   | Description            | Auth |
| ------ | -------------------------- | ---------------------- | ---- |
| POST   | `/restaurants/register`    | Register restaurant    | No   |
| POST   | `/restaurants/login`       | Restaurant login       | No   |
| GET    | `/restaurants`             | List all restaurants   | No   |
| GET    | `/restaurants/search`      | Search restaurants     | No   |
| GET    | `/restaurants/:id`         | Get restaurant details | No   |
| PATCH  | `/restaurants/me`          | Update name            | Yes  |
| PATCH  | `/restaurants/me/email`    | Update email           | Yes  |
| PATCH  | `/restaurants/me/address`  | Update address         | Yes  |
| POST   | `/restaurants/me/menu`     | Add food to menu       | Yes  |
| PATCH  | `/restaurants/me/menu/:id` | Update food item       | Yes  |
| DELETE | `/restaurants/me/menu/:id` | Remove food item       | Yes  |

### Orders

| Method | Endpoint                | Description           | Auth       |
| ------ | ----------------------- | --------------------- | ---------- |
| POST   | `/orders`               | Create order          | User       |
| GET    | `/orders/restaurant/me` | Get restaurant orders | Restaurant |
| PATCH  | `/orders/:id/status`    | Update order status   | Restaurant |

## Order Status Flow

`pending` → `confirmed` → `preparing` → `delivered`

Can be `cancelled` at any stage.

## Project Structure

```
backend/
├── index.js           # Application entry point
├── models/            # Mongoose models
├── routes/            # Express routes
├── services/          # Business logic layer
├── lib/               # Helper functions (auth, response helper)
├── package.json
└── Dockerfile
```

## Architecture

The project follows a three-layer architecture:

- **Routes** — Request validation and routing
- **Services** — Business logic
- **Models** — Database schema
