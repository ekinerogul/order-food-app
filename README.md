# 🍔 Order Food App

A full-stack food ordering application built during my software development bootcamp. Users can register, browse restaurants, and place orders. Restaurant owners can register and manage their menus.

## ✨ Current Features

### For Users:

- ✅ User registration with email/password
- ✅ Browse restaurants and view menus
- ✅ Place orders with multiple items
- ✅ Add multiple delivery addresses

### For Restaurant Owners:

- ✅ Restaurant registration
- ✅ Add menu items with prices and categories
- ✅ Set working hours

## 🛠️ Tech Stack

**Frontend:**

- Vue.js 3
- Pinia (State Management)
- Vue Router
- Axios

**Backend:**

- Node.js & Express.js
- MongoDB with Mongoose
- RESTful API design

**DevOps:**

- Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ekinerogul/order-food-app.git
cd order-food-app
```

2. Run with Docker:

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000

## 📚 API Endpoints

### Users

- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/:userId/addresses` - Add delivery address
- `POST /users/:userId/orders` - Create order

### Restaurants

- `POST /restaurants/register` - Register restaurant
- `POST /restaurants/login` - Restaurant login
- `PATCH /restaurants/:restaurantId/menu` - Add menu item

### Orders

- `GET /orders` - List all orders
- `GET /orders/search` - Search orders

## 📖 What I Learned

- Building RESTful APIs with Express
- MongoDB database design and relationships
- Vue.js component architecture and state management
- Docker containerization for full-stack apps
- API endpoint design and testing

## 🎯 Planned Features

- User login page
- Restaurant owner dashboard
- Order status tracking
- User reviews and ratings
- Password hashing (bcrypt)
- Payment integration

## 👤 Author

Ekin Eroğul - [GitHub](https://github.com/ekinerogul)
