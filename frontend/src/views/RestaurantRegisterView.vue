<script>
import { useRestaurantStore } from "@/stores/restaurantStore";

export default {
  name: "RestaurantRegisterView",
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      ownerName: "",
      street: "",
      city: "",
      zipCode: "",
      errorMessage: "",
    };
  },

  computed: {
    restaurantStore() {
      return useRestaurantStore();
    },
  },

  methods: {
    async register() {
      this.errorMessage = "";

      if (
        !this.email ||
        !this.password ||
        !this.name ||
        !this.ownerName ||
        !this.street ||
        !this.city
      ) {
        this.errorMessage = "All required fields must be filled.";
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "The password must be at least 6 characters long.";
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      if (this.name.length < 2) {
        this.errorMessage =
          "The restaurant name must be at least 2 characters long.";
        return;
      }

      if (this.ownerName.length < 2) {
        this.errorMessage =
          "The owner name must be at least 2 characters long.";
        return;
      }

      if (this.street.length < 5) {
        this.errorMessage =
          "The street address must be at least 5 characters long.";
        return;
      }

      if (this.city.length < 2) {
        this.errorMessage = "The city name must be at least 2 characters long.";
        return;
      }

      try {
        const address = {
          street: this.street,
          city: this.city,
          zipCode: this.zipCode,
        };

        const restaurant = await this.restaurantStore.registerRestaurant(
          this.email,
          this.password,
          this.name,
          this.ownerName,
          address
        );

        this.$router.push(
          `/restaurants/${restaurant.id || restaurant._id}/dashboard`
        );
      } catch (error) {
        this.errorMessage = error.message || "Registration failed.";
      }
    },
  },
};
</script>

<template lang="pug">
.register
  h1 Restaurant Registration

  .form
    p Email:
    input(v-model="email" type="email" placeholder="Email")

    p Password:
    input(v-model="password" type="password" placeholder="Password (min 6 chars)")

    p Confirm Password:
    input(v-model="passwordConfirm" type="password" placeholder="Confirm Password")

    p Restaurant Name:
    input(v-model="name" placeholder="Restaurant Name (min 2 chars)")

    p Owner Name:
    input(v-model="ownerName" placeholder="Owner Name (min 2 chars)")

    h3 Address

    p Street:
    input(v-model="street" placeholder="Street Address (min 5 chars)")

    p City:
    input(v-model="city" placeholder="City (min 2 chars)")

    p Zip Code (optional):
    input(v-model="zipCode" placeholder="Zip Code")

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    button(@click="register") Register

  p
    | Already have an account?&nbsp;
    router-link(to="/restaurants/login") Login here
</template>
