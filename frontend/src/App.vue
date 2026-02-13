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
};
</script>

<template lang="pug">
div#app
  router-view
</template>
