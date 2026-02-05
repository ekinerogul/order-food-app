import { defineStore } from "pinia";
import axios from "axios";

axios.defaults.baseURL =
  process.env.VUE_APP_BACKEND_URL || "http://localhost:3000";

export const useMainStore = defineStore("main", {
  state: () => ({
    countHome: 0,
    countAbout: 0,
    users: [],
    restaurants: [],
  }),

  actions: {
    increment(type) {
      if (type === "countHome") {
        this.countHome++;
      } else {
        this.countAbout++;
      }
    },

    decrement(type) {
      if (type === "countHome") {
        if (this.countHome === 0) return;
        this.countHome--;
      } else {
        if (this.countAbout === 0) return;
        this.countAbout--;
      }
    },

    async fetchUsers() {
      const res = await axios.get("/users");
      this.users = res.data;
    },
    async fetchUser(userId) {
      const res = await axios.get(`/users/${userId}`);
      return res.data;
    },
    async fetchRestaurants() {
      const res = await axios.get("/restaurants");
      this.restaurants = res.data;
    },
    async fetchRestaurant(restaurantId) {
      const res = await axios.get(`/restaurants/${restaurantId}`);
      return res.data;
    },
    async orderRestaurant({ userId, restaurantId, items, address }) {
      const res = await axios.post(`/users/${userId}/orders`, {
        restaurantId,
        items,
        address,
      });

      return res.data;
    },
    async addFoodToRestaurant({ restaurantId, name }) {
      const res = await axios.patch(`/restaurants/${restaurantId}/menu`, {
        name,
      });

      return res.data;
    },

    async registerUser(email, password, name, age) {
      const res = await axios.post("/users/register", {
        email,
        password,
        name,
        age,
      });
      return res.data;
    },

    async loginUser(email, password) {
      const res = await axios.post("/users/login", {
        email,
        password,
      });
      return res.data;
    },

    async addAddress(userId, address) {
      const res = await axios.post(`/users/${userId}/addresses`, address);
      return res.data;
    },

    async registerRestaurant(data) {
      const res = await axios.post("/restaurants/register", data);
      return res.data;
    },

    async loginRestaurant(email, password) {
      const res = await axios.post("/restaurants/login", {
        email,
        password,
      });
      return res.data;
    },
  },
});
