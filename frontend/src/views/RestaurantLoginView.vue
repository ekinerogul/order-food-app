<script>
import { useRestaurantStore } from "@/stores/restaurantStore";

export default {
  name: "RestaurantLoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },

  computed: {
    restaurantStore() {
      return useRestaurantStore();
    },
  },

  methods: {
    async login() {
      this.errorMessage = "";

      if (!this.email || !this.password) {
        this.errorMessage = "Email and password are required.";
        return;
      }

      try {
        const restaurant = await this.restaurantStore.loginRestaurant(
          this.email,
          this.password
        );

        this.$router.push(
          `/restaurants/${restaurant.id || restaurant._id}/dashboard`
        );
      } catch (error) {
        this.errorMessage = error.message || "Login failed.";
      }
    },
  },
};
</script>

<template lang="pug">
.login
  h1 Restaurant Login

  .form
    p Email:
    input(v-model="email" type="email" placeholder="Email" autocomplete="email")

    p Password:
    input(v-model="password" type="password" placeholder="Password" autocomplete="current-password")

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    button(@click="login") Login

  p
    | Don't have an account?&nbsp;
    router-link(to="/restaurants/register") Register here
</template>
