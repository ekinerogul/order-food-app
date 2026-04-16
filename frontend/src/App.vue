<script>
import { useUserStore } from "@/stores/userStore";
import { useRestaurantStore } from "@/stores/restaurantStore";

export default {
  name: "App",
  computed: {
    userStore() {
      return useUserStore();
    },
    restaurantStore() {
      return useRestaurantStore();
    },
    isUserLoggedIn() {
      return !!this.userStore.currentUser;
    },
    isRestaurantLoggedIn() {
      return !!this.restaurantStore.currentRestaurant;
    },
    isLoggedIn() {
      return this.isUserLoggedIn || this.isRestaurantLoggedIn;
    },
  },
  methods: {
    getActiveRole() {
      const authRole = localStorage.getItem("authRole");
      if (authRole) return authRole;

      const userToken = localStorage.getItem("userToken");
      const restaurantToken = localStorage.getItem("restaurantToken");

      if (userToken && !restaurantToken) return "user";
      if (restaurantToken && !userToken) return "restaurant";

      return null;
    },

    redirectTo(routeName) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
    },

    syncActiveSession() {
      const activeRole = this.getActiveRole();
      const userToken = localStorage.getItem("userToken");
      const restaurantToken = localStorage.getItem("restaurantToken");

      if (activeRole !== "user" || !userToken) {
        this.userStore.currentUser = null;
        this.userStore.token = null;
      }

      if (activeRole !== "restaurant" || !restaurantToken) {
        this.restaurantStore.currentRestaurant = null;
        this.restaurantStore.token = null;
      }

      if (
        this.$route.meta.requiresUserAuth &&
        (activeRole !== "user" || !userToken)
      ) {
        this.redirectTo("user-login");
      }

      if (
        this.$route.meta.requiresRestaurantAuth &&
        (activeRole !== "restaurant" || !restaurantToken)
      ) {
        this.redirectTo("restaurant-login");
      }
    },

    handleStorageChange(event) {
      const authKeys = [
        "authRole",
        "currentUser",
        "userToken",
        "currentRestaurant",
        "restaurantToken",
      ];

      if (authKeys.includes(event.key)) {
        this.syncActiveSession();
      }
    },
  },
  mounted() {
    window.addEventListener("storage", this.handleStorageChange);
    this.syncActiveSession();
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.handleStorageChange);
  },
};
</script>

<template lang="pug">
div#app
  router-view
</template>

<style>
@import "@/assets/styles/global.css";
</style>
