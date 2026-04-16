# Order Food App

A food ordering application where customers can order from restaurants, and restaurants can manage their menus and orders.

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
- **DevOps:** Docker, Docker Compose, Google Cloud Run, MongoDB Atlas

## Project Structure

```
order-food-app/
├── frontend/          # Vue.js frontend application
├── backend/           # Express.js REST API
├── data/              # MongoDB database files (volume)
├── docker-compose.yml # Spins up all services
└── README.md
```

## Getting Started

Docker and Docker Compose must be installed.

```bash
git clone <repo-url>
cd order-food-app
docker compose up --build
```

Once running:

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000
- **MongoDB:** localhost:27017

## Features

**Customer side:**

- Register and login (JWT authentication)
- Add, edit, and remove addresses
- Search restaurants by name or food
- Place food orders
- View order history
- Update profile information

**Restaurant side:**

- Register and login
- Menu management (add, edit, remove food items)
- View incoming orders and update their status
- Update profile and address information

## License

This project was built for educational purposes.
