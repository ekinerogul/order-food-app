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
    meta: { requiresRestaurantAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function getActiveRole() {
  const authRole = localStorage.getItem("authRole");
  if (authRole) return authRole;

  const userToken = localStorage.getItem("userToken");
  const restaurantToken = localStorage.getItem("restaurantToken");

  if (userToken && !restaurantToken) return "user";
  if (restaurantToken && !userToken) return "restaurant";

  return null;
}

router.beforeEach((to, from, next) => {
  const activeRole = getActiveRole();

  if (to.meta.requiresUserAuth) {
    const userToken = localStorage.getItem("userToken");
    if (!userToken || activeRole !== "user") {
      return next({ name: "user-login" });
    }
  }

  if (to.meta.requiresRestaurantAuth) {
    const restaurantToken = localStorage.getItem("restaurantToken");
    if (!restaurantToken || activeRole !== "restaurant") {
      return next({ name: "restaurant-login" });
    }
  }

  next();
});

export default router;
