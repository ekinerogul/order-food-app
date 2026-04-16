# Order Food App — Frontend

Single page application built with Vue.js 3. Provides separate interfaces for customers and restaurants.

## Tech Stack

- Vue.js 3 (Options API)
- Pinia — state management
- Vue Router — client-side routing
- Axios — HTTP requests
- Pug — template engine

## Setup

```bash
cd frontend
npm install
npm run serve
```

Default port: `8080`

Set `VUE_APP_BACKEND_URL` environment variable to configure the backend connection. Defaults to `http://localhost:3000`.

## Pages

| Page                 | URL                          | Description                       |
| -------------------- | ---------------------------- | --------------------------------- |
| Home                 | `/`                          | Customer / restaurant selection   |
| User Register        | `/users/register`            | Create new account                |
| User Login           | `/users/login`               | Login with existing account       |
| User Dashboard       | `/users/:id/dashboard`       | Profile, addresses, orders        |
| Create Order         | `/users/:id/order`           | Restaurant selection and ordering |
| Restaurant Register  | `/restaurants/register`      | Register new restaurant           |
| Restaurant Login     | `/restaurants/login`         | Restaurant login                  |
| Restaurant Dashboard | `/restaurants/:id/dashboard` | Menu and order management         |

## Project Structure

```
frontend/src/
├── main.js                # Application entry point
├── App.vue                # Root component
├── router/
│   └── index.js           # Route definitions and navigation guards
├── stores/
│   ├── mainStore.js       # Order flow orchestration
│   ├── userStore.js       # User state and API calls
│   ├── restaurantStore.js # Restaurant state and API calls
│   └── orderStore.js      # Order API calls
├── views/
│   ├── HomeView.vue
│   ├── UserRegisterView.vue
│   ├── UserLoginView.vue
│   ├── UserDashboardView.vue
│   ├── CreateOrderView.vue
│   ├── RestaurantRegisterView.vue
│   ├── RestaurantLoginView.vue
│   └── RestaurantDashboardView.vue
└── components/
    ├── AddressForm.vue          # Address input form
    ├── OrderCard.vue            # Customer order card
    ├── MenuItemCard.vue         # Editable menu item card
    └── RestaurantOrderCard.vue  # Restaurant order card with status controls
```

## State Management

Pinia stores are used. Each store is responsible for its own domain:

- **userStore** — User authentication, profile, address management
- **restaurantStore** — Restaurant authentication, menu, order management
- **orderStore** — Order creation API call
- **mainStore** — Cross-store order flow coordination

Session data is persisted in localStorage to survive page refreshes.

## Authentication

JWT token-based authentication. Router navigation guards protect dashboard pages and redirect to login if no token is found.
