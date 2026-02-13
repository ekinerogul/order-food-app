import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import UserRegisterView from "@/views/UserRegisterView.vue";
import UserLoginView from "@/views/UserLoginView.vue";
import UserDashboardView from "@/views/UserDashboardView.vue";
import CreateOrderView from "@/views/CreateOrderView.vue";

import RestaurantRegisterView from "@/views/RestaurantRegisterView.vue";
import RestaurantLoginView from "@/views/RestaurantLoginView.vue";
import RestaurantDashboardView from "@/views/RestaurantDashboardView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/users/register",
    name: "user-register",
    component: UserRegisterView,
  },
  {
    path: "/users/login",
    name: "user-login",
    component: UserLoginView,
  },
  {
    path: "/users/:userId/dashboard",
    name: "user-dashboard",
    component: UserDashboardView,
    props: true,
    meta: { requiresUserAuth: true },
  },
  {
    path: "/users/:userId/order",
    name: "create-order",
    component: CreateOrderView,
    props: true,
    meta: { requiresUserAuth: true },
  },
  {
    path: "/restaurants/register",
    name: "restaurant-register",
    component: RestaurantRegisterView,
  },
  {
    path: "/restaurants/login",
    name: "restaurant-login",
    component: RestaurantLoginView,
  },
  {
    path: "/restaurants/:restaurantId/dashboard",
    name: "restaurant-dashboard",
    component: RestaurantDashboardView,
    props: true,
    meta: { requiresUserAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresUserAuth) {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return next({ name: "user-login" });
  }

  if (to.meta.requiresRestaurantAuth) {
    const restaurantToken = localStorage.getItem("restaurantToken");
    if (!restaurantToken) return next({ name: "restaurant-login" });
  }

  next();
});

export default router;
