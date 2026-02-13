<script>
import { useMainStore } from "@/stores/mainStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "CreateOrderView",
  props: ["userId"],
  data() {
    return {
      isLoading: true,
      addressId: "",
      expandedRestaurant: null,
      selectedFood: {},
      quantities: {},
      searchName: "",
      searchFood: "",
      searchResults: null,
      errorMessage: "",
    };
  },

  computed: {
    mainStore() {
      return useMainStore();
    },
    restaurantStore() {
      return useRestaurantStore();
    },
    userStore() {
      return useUserStore();
    },

    displayedRestaurants() {
      if (this.searchResults !== null) {
        return this.searchResults;
      }
      return this.restaurantStore.restaurants;
    },

    selectedAddress() {
      if (!this.userStore.currentUser) return null;
      return this.userStore.currentUser.addresses.find(
        (a) => a._id === this.addressId,
      );
    },
  },

  async mounted() {
    this.addressId = this.$route.query.addressId;

    if (!this.addressId) {
      this.$router.push(`/users/${this.userId}/dashboard`);
      return;
    }

    try {
      await this.restaurantStore.fetchRestaurants();
    } catch (error) {
      this.errorMessage = "Failed to load restaurants.";
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    toggleRestaurant(restaurantId) {
      if (this.expandedRestaurant === restaurantId) {
        this.expandedRestaurant = null;
      } else {
        this.expandedRestaurant = restaurantId;
      }
    },

    async searchRestaurants() {
      this.errorMessage = "";

      if (!this.searchName && !this.searchFood) {
        this.searchResults = null;
        return;
      }

      try {
        this.searchResults = await this.restaurantStore.searchRestaurants({
          name: this.searchName,
          food: this.searchFood,
        });
      } catch (error) {
        this.errorMessage = error.message || "Search failed.";
      }
    },

    clearSearch() {
      this.searchName = "";
      this.searchFood = "";
      this.searchResults = null;
    },

    selectFood(restaurantId, menuItem) {
      if (!menuItem) return;

      this.selectedFood = {
        ...this.selectedFood,
        [restaurantId]: {
          name: menuItem.name,
          price: menuItem.price,
        },
      };

      if (!this.quantities[restaurantId]) {
        this.quantities = { ...this.quantities, [restaurantId]: 1 };
      }
    },

    updateQuantity(restaurantId, value) {
      const safeValue = Math.max(1, Math.floor(Number(value) || 1));
      this.quantities = { ...this.quantities, [restaurantId]: safeValue };
    },

    async createOrder(restaurantId) {
      this.errorMessage = "";

      if (!this.selectedFood[restaurantId]) {
        this.errorMessage = "Please select a food item.";
        return;
      }

      const quantity = Math.max(
        1,
        Math.floor(Number(this.quantities[restaurantId]) || 1),
      );

      try {
        await this.mainStore.createOrderFlow({
          restaurantId,
          addressId: this.addressId,
          items: [
            {
              foodName: this.selectedFood[restaurantId].name,
              price: this.selectedFood[restaurantId].price,
              quantity,
            },
          ],
        });

        await this.userStore.refreshCurrentUser();

        this.$router.push(`/users/${this.userId}/dashboard`);
      } catch (error) {
        this.errorMessage = error.message || "Order failed.";
      }
    },

    goBack() {
      this.$router.push(`/users/${this.userId}/dashboard`);
    },
  },
};
</script>

<template lang="pug">
.createorder
  p(v-if="isLoading") Loading restaurants...

  div(v-else)
    div(style="display: flex; justify-content: space-between; align-items: center")
      h1 Order Food
      button(@click="goBack") Back to Dashboard

    div(v-if="selectedAddress" style="background: #f0f8ff; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px")
      strong Delivery Address:&nbsp;
      | {{ selectedAddress.street }}, {{ selectedAddress.city }}

    div(style="margin-bottom: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 6px")
      h3(style="margin-top: 0") Search Restaurants
      div(style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center")
        input(
          v-model="searchName"
          placeholder="Restaurant name..."
          @keyup.enter="searchRestaurants"
        )
        input(
          v-model="searchFood"
          placeholder="Food name..."
          @keyup.enter="searchRestaurants"
        )
        button(@click="searchRestaurants") Search
        button(v-if="searchResults !== null" @click="clearSearch") Clear

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    div(v-if="displayedRestaurants.length")
      div(
        v-for="restaurant in displayedRestaurants"
        :key="restaurant._id"
        style="border: 1px solid #ddd; margin: 10px 0; border-radius: 8px; overflow: hidden"
      )
        div(
          @click="toggleRestaurant(restaurant._id)"
          style="padding: 12px 16px; background: #f9f9f9; cursor: pointer; display: flex; justify-content: space-between; align-items: center"
        )
          div
            strong {{ restaurant.name }}
            p(v-if="restaurant.address" style="margin: 2px 0; font-size: 13px; color: #666")
              | {{ restaurant.address.street }}, {{ restaurant.address.city }}
          span {{ expandedRestaurant === restaurant._id ? '▲' : '▼' }}

        div(
          v-if="expandedRestaurant === restaurant._id"
          style="padding: 12px 16px"
        )
          div(v-if="restaurant.menu && restaurant.menu.length")
            h3(style="margin-top: 0") Menu
            div(
              v-for="item in restaurant.menu"
              :key="item._id"
              style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee"
            )
              div
                strong {{ item.name }}
                span(style="color: #666; margin-left: 8px") {{ item.price }} TL
                span(v-if="item.category" style="color: #999; margin-left: 8px; font-size: 12px")
                  | ({{ item.category }})
              button(
                @click="selectFood(restaurant._id, item)"
                style="cursor: pointer; padding: 4px 12px"
              ) Select

            div(v-if="selectedFood[restaurant._id]" style="margin-top: 12px; padding: 12px; background: #f0fff0; border-radius: 6px")
              p
                strong Selected:&nbsp;
                | {{ selectedFood[restaurant._id].name }} - {{ selectedFood[restaurant._id].price }} TL
              div(style="display: flex; align-items: center; gap: 8px; margin-top: 8px")
                label Quantity:
                input(
                  type="number"
                  :value="quantities[restaurant._id] || 1"
                  @input="updateQuantity(restaurant._id, $event.target.value)"
                  min="1"
                  style="width: 60px"
                )
                button(
                  @click="createOrder(restaurant._id)"
                  style="padding: 8px 20px; background: #27ae60; color: white; border: none; cursor: pointer; border-radius: 4px"
                ) Place Order

          p(v-else style="color: #999") This restaurant doesn't have a menu yet.

    p(v-else) No restaurants found.
</template>
