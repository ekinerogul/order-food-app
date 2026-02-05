<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "RestaurantsView",
  data() {
    return {
      store: useMainStore(),
      isLoading: true,
    };
  },

  async mounted() {
    await this.store.fetchRestaurants();
    this.isLoading = false;
  },

  computed: {
    restaurants() {
      return this.store.restaurants;
    },
  },
};
</script>

<template lang="pug">
.restaurants
  h1 Restaurants
  
  p(v-if="isLoading") Please wait...
  div(v-else)
    p There are {{ restaurants.length }} restaurants ready for order.

    ol
      li(
        v-for="restaurant in restaurants"
        :key="restaurant._id"
      )
        a(:href="`/restaurants/${restaurant._id}`")
          | {{ restaurant.name }}
</template>
