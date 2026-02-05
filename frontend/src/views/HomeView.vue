<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "HomeView",
  data() {
    return {
      store: useMainStore(),
    };
  },
  methods: {
    goUsers() {
      this.$router.push({ name: "users" });
    },
    goRestaurants() {
      this.$router.push({ name: "restaurants" });
    },
  },
};
</script>

<template lang="pug">
.home
  h1 Welcome to Order Food App

  .actions
    button(@click="goUsers") Users
    button(@click="goRestaurants") Restaurants
</template>
