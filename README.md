# Order Food App

A full-stack food ordering application where customers can order from restaurants, and restaurants can manage their menus and incoming orders.

This is my first full-stack project, built from scratch using the technologies I learned during the Coyotiv coding bootcamp.

## Live Demo

- **Frontend:** https://order-food-frontend-443821973119.europe-west3.run.app
- **Backend API:** https://order-food-backend-443821973119.europe-west3.run.app

The production version is deployed on Google Cloud Run and uses MongoDB Atlas for database storage.

## Demo Account

If you do not want to create a new account, you can try the app with this demo customer account:

- **Email:** user1@gmail.com
- **Password:** user1.

## Tech Stack

- **Frontend:** Vue.js 3, Pinia, Vue Router, Axios, Pug
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Database:** MongoDB Atlas in production, MongoDB locally
- **DevOps:** Docker, Docker Compose, Google Cloud Run

## Features

### Customer Side

- Register and login with JWT authentication
- Add, edit, and remove delivery addresses
- Search restaurants by name or food
- Place food orders
- View order history
- Update profile information

### Restaurant Side

- Register and login as a restaurant
- Add, edit, and remove menu items
- View incoming orders
- Update order statuses
- Update restaurant profile and address information

## Project Structure

```text
order-food-app/
├── frontend/          # Vue.js frontend application
├── backend/           # Express.js REST API
├── data/              # Local MongoDB database files
├── docker-compose.yml # Local Docker setup
└── README.md
```

## Local Setup

Docker and Docker Compose must be installed.

Clone the repository:

```bash
git clone <repo-url>
cd order-food-app
```

Create a local `.env` file in the project root:

```env
MONGODB_CONNECTION_STRING=mongodb://mongodb:27017/projectz
```

Start the project:

```bash
docker compose up --build
```

Once running:

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **MongoDB:** localhost:27017

## Deployment

The deployed version runs on Google Cloud Run:

- The backend service connects to MongoDB Atlas with `MONGODB_CONNECTION_STRING`.
- The frontend is configured to call the deployed backend API.

## License

This project was built for educational purposes.
