import { defineStore } from "pinia";
import axios from "axios";

export const useRestaurantStore = defineStore("restaurant", {
  state: () => ({
    restaurants: [],
    currentRestaurant:
      JSON.parse(localStorage.getItem("currentRestaurant")) || null,
    token: localStorage.getItem("restaurantToken") || null,
  }),
  actions: {
    saveToStorage() {
      if (this.currentRestaurant) {
        localStorage.setItem(
          "currentRestaurant",
          JSON.stringify(this.currentRestaurant),
        );
      } else {
        localStorage.removeItem("currentRestaurant");
      }

      if (this.token) {
        localStorage.setItem("restaurantToken", this.token);
      } else {
        localStorage.removeItem("restaurantToken");
      }
    },

    getAuthHeader() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    },

    async fetchRestaurants() {
      const res = await axios.get("/restaurants");
      this.restaurants = res.data.data;
    },

    async fetchRestaurant(restaurantId) {
      const res = await axios.get(`/restaurants/${restaurantId}`);
      return res.data.data;
    },

    async searchRestaurants({ name, food }) {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (food) params.append("food", food);

      const res = await axios.get(`/restaurants/search?${params.toString()}`);
      return res.data.data;
    },

    async registerRestaurant(email, password, name, ownerName, address) {
      try {
        const res = await axios.post("/restaurants/register", {
          email,
          password,
          name,
          ownerName,
          address,
        });

        this.token = res.data.data.token;
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Registration failed";
        throw new Error(message);
      }
    },

    async loginRestaurant(email, password) {
      try {
        const res = await axios.post("/restaurants/login", {
          email,
          password,
        });

        this.token = res.data.data.token;
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        throw new Error(message);
      }
    },

    async updateName(name) {
      try {
        const res = await axios.patch(
          "/restaurants/me",
          { name },
          { headers: this.getAuthHeader() },
        );
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update name";
        throw new Error(message);
      }
    },

    async updateEmail(email) {
      try {
        const res = await axios.patch(
          "/restaurants/me/email",
          { email },
          { headers: this.getAuthHeader() },
        );
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update email";
        throw new Error(message);
      }
    },

    async updateAddress(address) {
      try {
        const res = await axios.patch("/restaurants/me/address", address, {
          headers: this.getAuthHeader(),
        });
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update address";
        throw new Error(message);
      }
    },

    async addFoodToRestaurant({ name, price, category }) {
      try {
        const res = await axios.post(
          "/restaurants/me/menu",
          { name, price, category },
          { headers: this.getAuthHeader() },
        );
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Failed to add food";
        throw new Error(message);
      }
    },

    async updateFoodInRestaurant({ foodId, updateData }) {
      try {
        const res = await axios.patch(
          `/restaurants/me/menu/${foodId}`,
          updateData,
          { headers: this.getAuthHeader() },
        );
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update food";
        throw new Error(message);
      }
    },

    async removeFoodFromRestaurant(foodId) {
      try {
        const res = await axios.delete(`/restaurants/me/menu/${foodId}`, {
          headers: this.getAuthHeader(),
        });
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to remove food";
        throw new Error(message);
      }
    },

    async fetchRestaurantOrders() {
      const res = await axios.get("/orders/restaurant/me", {
        headers: this.getAuthHeader(),
      });
      return res.data.data;
    },

    async updateOrderStatus(orderId, status) {
      const res = await axios.patch(
        `/orders/${orderId}/status`,
        { status },
        { headers: this.getAuthHeader() },
      );
      return res.data.data;
    },

    async refreshCurrentRestaurant() {
      if (!this.currentRestaurant || !this.token) return;
      try {
        const id = this.currentRestaurant._id || this.currentRestaurant.id;
        const res = await axios.get(`/restaurants/${id}`);
        this.currentRestaurant = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to refresh restaurant";
        throw new Error(message);
      }
    },

    logout() {
      this.currentRestaurant = null;
      this.token = null;
      this.saveToStorage();
    },
  },
});
