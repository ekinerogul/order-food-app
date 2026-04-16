<script>
import { useRestaurantStore } from "@/stores/restaurantStore";
import RestaurantOrderCard from "@/components/RestaurantOrderCard.vue";
import MenuItemCard from "@/components/MenuItemCard.vue";

export default {
  name: "RestaurantDashboardView",
  props: ["restaurantId"],
  components: {
    RestaurantOrderCard,
    MenuItemCard,
  },
  data() {
    return {
      isLoading: true,
      restaurant: null,
      orders: [],
      newFood: {
        name: "",
        price: "",
        category: "",
      },
      editingName: false,
      editName: "",
      editingEmail: false,
      editEmail: "",
      editingAddress: false,
      editAddress: { street: "", city: "", zipCode: "" },
      errorMessage: "",
      successMessage: "",
    };
  },

  computed: {
    restaurantStore() {
      return useRestaurantStore();
    },

    pendingOrders() {
      return this.orders.filter((o) => o.status === "pending");
    },

    activeOrders() {
      return this.orders.filter(
        (o) => o.status === "confirmed" || o.status === "preparing"
      );
    },

    completedOrders() {
      return this.orders.filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
      );
    },
  },

  async mounted() {
    await this.loadData();
    this.isLoading = false;
  },

  methods: {
    showSuccess(msg) {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ""), 3000);
    },

    async loadData() {
      try {
        this.restaurant = await this.restaurantStore.fetchRestaurant(
          this.restaurantId
        );
        this.restaurantStore.currentRestaurant = this.restaurant;
        this.restaurantStore.saveToStorage();
      } catch (error) {
        this.errorMessage = "Failed to load restaurant data.";
        return;
      }

      try {
        this.orders = await this.restaurantStore.fetchRestaurantOrders();
      } catch (error) {
        this.errorMessage = "Failed to load orders.";
      }
    },

    async addFood() {
      this.errorMessage = "";

      if (!this.newFood.name) {
        this.errorMessage = "Food name is required.";
        return;
      }

      if (this.newFood.name.length < 2) {
        this.errorMessage = "The food name must be at least 2 characters long.";
        return;
      }

      if (!this.newFood.price) {
        this.errorMessage = "Price is required.";
        return;
      }

      const price = Number(this.newFood.price);
      if (isNaN(price) || price < 10) {
        this.errorMessage = "The price must be at least 10.";
        return;
      }

      if (this.newFood.category && this.newFood.category.length < 2) {
        this.errorMessage = "The category must have at least 2 characters.";
        return;
      }

      try {
        await this.restaurantStore.addFoodToRestaurant({
          name: this.newFood.name,
          price,
          category: this.newFood.category || "General",
        });

        this.newFood = { name: "", price: "", category: "" };
        this.showSuccess("Food added to menu!");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to add food.";
      }
    },

    async handleFoodUpdate({ foodId, updateData }) {
      this.errorMessage = "";

      try {
        await this.restaurantStore.updateFoodInRestaurant({
          foodId,
          updateData,
        });
        this.showSuccess("Food updated.");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update food.";
      }
    },

    async removeFood(foodId) {
      if (!confirm("Are you sure?")) return;

      this.errorMessage = "";
      try {
        await this.restaurantStore.removeFoodFromRestaurant(foodId);
        this.showSuccess("Food removed from menu.");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to remove food.";
      }
    },

    async handleStatusUpdate({ orderId, newStatus }) {
      this.errorMessage = "";
      try {
        await this.restaurantStore.updateOrderStatus(orderId, newStatus);
        this.showSuccess("Order status updated to " + newStatus + ".");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update order status.";
      }
    },

    startEditName() {
      this.editName = this.restaurant.name;
      this.editingName = true;
    },

    async saveName() {
      this.errorMessage = "";

      if (!this.editName || this.editName.length < 2) {
        this.errorMessage = "Name must be at least 2 characters.";
        return;
      }

      try {
        await this.restaurantStore.updateName(this.editName);
        this.editingName = false;
        this.showSuccess("Name updated.");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update name.";
      }
    },

    startEditEmail() {
      this.editEmail = this.restaurant.email;
      this.editingEmail = true;
    },

    async saveEmail() {
      this.errorMessage = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editEmail)) {
        this.errorMessage = "Please enter a valid email address.";
        return;
      }

      try {
        await this.restaurantStore.updateEmail(this.editEmail);
        this.editingEmail = false;
        this.showSuccess("Email updated.");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update email.";
      }
    },

    startEditAddress() {
      this.editAddress = {
        street: this.restaurant.address?.street || "",
        city: this.restaurant.address?.city || "",
        zipCode: this.restaurant.address?.zipCode || "",
      };
      this.editingAddress = true;
    },

    async saveAddress() {
      this.errorMessage = "";

      if (!this.editAddress.street || !this.editAddress.city) {
        this.errorMessage = "Street and city are required.";
        return;
      }

      if (this.editAddress.street.length < 5) {
        this.errorMessage = "Street must be at least 5 characters.";
        return;
      }

      if (this.editAddress.city.length < 2) {
        this.errorMessage = "City must be at least 2 characters.";
        return;
      }

      try {
        await this.restaurantStore.updateAddress(this.editAddress);
        this.editingAddress = false;
        this.showSuccess("Address updated.");
        await this.loadData();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update address.";
      }
    },

    logout() {
      this.restaurantStore.logout();
      this.$router.push("/restaurants/login");
    },
  },
};
</script>

<template lang="pug">
.dashboard
  p(v-if="isLoading") Loading...

  div(v-else-if="restaurant")
    div.header-row
      h1 {{ restaurant.name }} Dashboard
      button.logout-btn(@click="logout") Logout

    div
      div(v-if="!editingName")
        | Name: {{ restaurant.name }}&nbsp;
        button(@click="startEditName") Edit
      div(v-else)
        input(v-model="editName" placeholder="New name")
        button(@click="saveName") Save
        button(@click="editingName = false") Cancel

    p Owner: {{ restaurant.ownerName }}

    div
      div(v-if="!editingEmail")
        | Email: {{ restaurant.email }}&nbsp;
        button(@click="startEditEmail") Edit
      div(v-else)
        input(v-model="editEmail" type="email" placeholder="New email")
        button(@click="saveEmail") Save
        button(@click="editingEmail = false") Cancel

    div
      div(v-if="!editingAddress")
        | Address: {{ restaurant.address?.street }}, {{ restaurant.address?.city }}
        span(v-if="restaurant.address?.zipCode") &nbsp;- {{ restaurant.address.zipCode }}
        | &nbsp;
        button(@click="startEditAddress") Edit
      div(v-else)
        p Street:
        input(v-model="editAddress.street" placeholder="Street")
        p City:
        input(v-model="editAddress.city" placeholder="City")
        p Zip Code:
        input(v-model="editAddress.zipCode" placeholder="Zip Code")
        button(@click="saveAddress") Save
        button(@click="editingAddress = false") Cancel

    p.error-msg(v-if="errorMessage") {{ errorMessage }}
    p.success-msg(v-if="successMessage") {{ successMessage }}

    h2 Menu

    div(v-if="restaurant.menu && restaurant.menu.length")
      MenuItemCard(
        v-for="item in restaurant.menu"
        :key="item._id"
        :item="item"
        :editable="true"
        @update="handleFoodUpdate"
        @remove="removeFood"
      )

    p.muted(v-else) No food in menu yet.

    h3 Add Food to Menu
    div.add-food-form
      p Food Name:
      input(v-model="newFood.name" placeholder="Food Name (min 2 chars)")

      p Price:
      input(v-model="newFood.price" type="number" placeholder="Price (min 10, required)")

      p Category (optional):
      input(v-model="newFood.category" placeholder="Category")

      button(@click="addFood") Add Food

    h2 Pending Orders ({{ pendingOrders.length }})

    div(v-if="pendingOrders.length")
      RestaurantOrderCard(
        v-for="order in pendingOrders"
        :key="order._id"
        :order="order"
        @status-updated="handleStatusUpdate"
      )

    p.muted(v-else) No pending orders.

    h2 Active Orders ({{ activeOrders.length }})

    div(v-if="activeOrders.length")
      RestaurantOrderCard(
        v-for="order in activeOrders"
        :key="order._id"
        :order="order"
        @status-updated="handleStatusUpdate"
      )

    p.muted(v-else) No active orders.

    h2 Order History ({{ completedOrders.length }})

    div(v-if="completedOrders.length")
      RestaurantOrderCard(
        v-for="order in completedOrders"
        :key="order._id"
        :order="order"
        @status-updated="handleStatusUpdate"
      )

    p.muted(v-else) No completed orders yet.
</template>
