<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "CreateOrderView",
  props: ["userId"],
  data() {
    return {
      store: useMainStore(),
      isLoading: true,
      user: {},
      address: "",
      selectedFood: {},
    };
  },

  async mounted() {
    this.user = await this.store.fetchUser(this.userId);
    await this.store.fetchRestaurants();
    this.isLoading = false;
  },

  computed: {
    restaurants() {
      return this.store.restaurants;
    },
  },

  methods: {
    async createOrder({ restaurantId, food, address }) {
      await this.store.orderRestaurant({
        userId: this.user._id,
        restaurantId,
        food,
        address,
      });

      this.$router.push(`/users/${this.userId}`);
    },
  },
};
</script>

<template lang="pug">
.createorder
  p(v-if="isLoading") Please wait...
  div(v-else)
    h1 Create Order for {{ user.name }}

    p Address:
    input(v-model="address" placeholder="Enter address")

    div(v-if="restaurants.length")
      h3 Select Restaurant and food
      ol
        li(v-for="restaurant in restaurants" :key="restaurant._id")
          | {{ restaurant.name }}
          select(
            v-if="restaurant.menu && restaurant.menu.length"
            v-model="selectedFood[restaurant._id]"
          )
            option(disabled value="") Select food
            option(
              v-for="item in restaurant.menu"
              :key="item.food.name"
              :value="item.food.name"
            ) {{ item.food.name }}
          
          button(
            :disabled="!address || !selectedFood[restaurant._id]"
            @click="createOrder({ restaurantId: restaurant._id, food: selectedFood[restaurant._id], address })"
          ) Order
</template>