<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "RestaurantView",
  data() {
    return {
      store: useMainStore(),
      isLoading: true,
      restaurant: {},
      foodName: "",
    };
  },

  async mounted() {
    await this.fetchRestaurant();
    this.isLoading = false;
  },

  methods: {
    async fetchRestaurant() {
      this.restaurant = await this.store.fetchRestaurant(
        this.$route.params.restaurantId
      );
    },
    async addFood() {
      if (!this.foodName) return;

      await this.store.addFoodToRestaurant({
        restaurantId: this.restaurant._id,
        name: this.foodName,
      });

      this.foodName = "";
      await this.fetchRestaurant();
    },
  },
};
</script>

<template lang="pug">
.restaurant
  p(v-if="isLoading") Please wait...
  div(v-else)
    h1 {{ restaurant.name }}

    h2 Menu
    div(v-if="restaurant.menu && restaurant.menu.length")
      ol
        li(
          v-for="item in restaurant.menu"
          :key="item.food.name"
        )
          | {{ item.food.name }}
    p(v-else) No food yet.

    h2 Add Food
    input(
      v-model="foodName"
      placeholder="FoodName"
    )
    button(
      :disabled="!foodName"
      @click="addFood"
    ) Add
</template>
