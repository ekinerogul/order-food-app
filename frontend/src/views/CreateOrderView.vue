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
        (a) => a._id === this.addressId
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
        Math.floor(Number(this.quantities[restaurantId]) || 1)
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
    div.createorder-header
      h1 Order Food
      button(@click="goBack") Back to Dashboard

    div.delivery-address(v-if="selectedAddress")
      strong Delivery Address:&nbsp;
      | {{ selectedAddress.street }}, {{ selectedAddress.city }}

    div.search-panel
      h3 Search Restaurants
      div.search-row
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
        class="restaurant-result"
      )
        div(
          @click="toggleRestaurant(restaurant._id)"
          class="restaurant-toggle"
        )
          div
            strong {{ restaurant.name }}
            p.restaurant-address(v-if="restaurant.address")
              | {{ restaurant.address.street }}, {{ restaurant.address.city }}
          span {{ expandedRestaurant === restaurant._id ? '▲' : '▼' }}

        div(
          v-if="expandedRestaurant === restaurant._id"
          class="restaurant-menu-panel"
        )
          div(v-if="restaurant.menu && restaurant.menu.length")
            h3 Menu
            div(
              v-for="item in restaurant.menu"
              :key="item._id"
              class="order-menu-item"
            )
              div
                strong {{ item.name }}
                span.food-price {{ item.price }} TL
                span.food-category(v-if="item.category")
                  | ({{ item.category }})
              button(@click="selectFood(restaurant._id, item)") Select

            div.selected-food(v-if="selectedFood[restaurant._id]")
              p
                strong Selected:&nbsp;
                | {{ selectedFood[restaurant._id].name }} - {{ selectedFood[restaurant._id].price }} TL
              div.quantity-row
                label Quantity:
                input(
                  type="number"
                  :value="quantities[restaurant._id] || 1"
                  @input="updateQuantity(restaurant._id, $event.target.value)"
                  min="1"
                  class="quantity-input"
                )
                button(@click="createOrder(restaurant._id)") Place Order

          p.muted(v-else) This restaurant doesn't have a menu yet.

    p(v-else) No restaurants found.
</template>
