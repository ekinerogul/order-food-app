import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UsersView from "../views/UsersView.vue";
import UserView from "../views/UserView.vue";
import CreateOrderView from "../views/CreateOrderView.vue";
import RestaurantsView from "../views/RestaurantsView.vue";
import RestaurantView from "../views/RestaurantView.vue";
import UserRegisterView from "../views/UserRegisterView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/users",
    name: "users",
    component: UsersView,
  },
  {
    path: "/users/:userId",
    name: "user-detail",
    component: UserView,
    props: true,
  },
  {
    path: "/users/:userId/order",
    name: "create-order",
    component: CreateOrderView,
    props: true,
  },
  {
    path: "/restaurants",
    name: "restaurants",
    component: RestaurantsView,
  },
  {
    path: "/restaurants/:restaurantId",
    name: "restaurant-detail",
    component: RestaurantView,
    props: true,
  },
  {
    path: "/register",
    name: "user-register",
    component: UserRegisterView,
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
