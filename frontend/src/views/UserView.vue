<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "UserView",
  data() {
    return {
      store: useMainStore(),
      isLoading: true,
      user: {},
      // address: "",
      // selectedFood: {},
    };
  },

  async mounted() {
    await this.updateUser();
    // await this.updateUser(), await this.store.fetchRestaurants();
    // this.restaurants = this.store.restaurants;
    this.isLoading = false;
  },
  methods: {
    async updateUser() {
      this.user = await this.store.fetchUser(this.$route.params.userId);
    },
    goToCreateOrder() {
      this.$router.push(`/users/${this.user._id}/order`);
    },

    // async orderAndUpdateUser({ restaurantId, food, address }) {
    //   await this.store.orderRestaurant({
    //     userId: this.user._id,
    //     restaurantId,
    //     food,
    //     address,
    //   });

    //   await this.updateUser();
    // },
  },

  watch: {
    "user.orders"(orders) {
      console.log("orders updated", orders);
    },
  },
};
</script>

<template lang="pug">
.user
  p(v-if="isLoading") Please wait...
  div(v-else)
    h1 User Detail
    p {{ user.name }}

    h2 Order History
    div(v-if="user.orders && user.orders.length")
      ol
        li(v-for="order in user.orders" :key="order._id")
          | {{ user.name }} wants to order {{ order.food }} from {{ order.restaurant.name }} to {{ order.address }}
    p(v-else) No orders yet.

    button(@click="goToCreateOrder") Create New Order

    //- h2 Create New Order
    //- p Address:&nbsp;
    //-   input(v-model="address")

    //- div(v-if="restaurants.length")
    //-   h3 restaurants
    //-   ol
    //-     li(v-for="restaurant in restaurants" :key="restaurant._id")
    //-       | {{ restaurant.name }}
    //-       select(
    //-         v-if="restaurant.menu && restaurant.menu.length"
    //-         v-model="selectedFood[restaurant._id]"
    //-       )
    //-         option(disabled value="") Select food
    //-         option(
    //-             v-for="item in restaurant.menu"
    //-             :key="item.name"
    //-             :value="item.name"
    //-         ) {{ item.food.name }}
          
    //-       button(
    //-         :disabled="!selectedFood[restaurant._id] || !address"
    //-         @click="orderAndUpdateUser({ restaurantId: restaurant._id, food: selectedFood[restaurant._id], address })"
    //-       ) Order
</template>
