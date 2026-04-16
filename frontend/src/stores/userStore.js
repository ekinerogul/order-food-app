import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    token: localStorage.getItem("userToken") || null,
  }),
  actions: {
    activateUserSession() {
      localStorage.removeItem("currentRestaurant");
      localStorage.removeItem("restaurantToken");
      localStorage.setItem("authRole", "user");
    },

    saveToStorage() {
      if (this.currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }

      if (this.token) {
        localStorage.setItem("userToken", this.token);
      } else {
        localStorage.removeItem("userToken");
      }
    },

    getAuthHeader() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    },

    async fetchUsers() {
      try {
        const res = await axios.get("/users");
        this.users = res.data.data;
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch users";
        throw new Error(message);
      }
    },

    async fetchUser() {
      try {
        const res = await axios.get("/users/me", {
          headers: this.getAuthHeader(),
        });
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch user";
        throw new Error(message);
      }
    },

    async registerUser(email, password, name, age) {
      try {
        const res = await axios.post("/users/register", {
          email,
          password,
          name,
          age,
        });

        this.token = res.data.data.token;
        this.currentUser = res.data.data;
        this.activateUserSession();
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message = error.response?.data?.message || "Registration failed";
        throw new Error(message);
      }
    },

    async loginUser(email, password) {
      try {
        const res = await axios.post("/users/login", { email, password });

        this.token = res.data.data.token;
        this.currentUser = res.data.data;
        this.activateUserSession();
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
          "/users/me",
          { name },
          { headers: this.getAuthHeader() }
        );
        this.currentUser = res.data.data;
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
          "/users/me/email",
          { email },
          { headers: this.getAuthHeader() }
        );
        this.currentUser = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update email";
        throw new Error(message);
      }
    },

    async addAddress(address) {
      try {
        const res = await axios.post("/users/me/addresses", address, {
          headers: this.getAuthHeader(),
        });
        this.currentUser = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to add address";
        throw new Error(message);
      }
    },

    async updateAddress(addressId, updateData) {
      try {
        const res = await axios.patch(
          `/users/me/addresses/${addressId}`,
          updateData,
          { headers: this.getAuthHeader() }
        );
        this.currentUser = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update address";
        throw new Error(message);
      }
    },

    async removeAddress(addressId) {
      try {
        const res = await axios.delete(`/users/me/addresses/${addressId}`, {
          headers: this.getAuthHeader(),
        });
        this.currentUser = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to remove address";
        throw new Error(message);
      }
    },

    async refreshCurrentUser() {
      if (!this.token) return;
      try {
        const res = await axios.get("/users/me", {
          headers: this.getAuthHeader(),
        });
        this.currentUser = res.data.data;
        this.saveToStorage();
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to refresh user";
        throw new Error(message);
      }
    },

    logout() {
      this.currentUser = null;
      this.token = null;
      if (localStorage.getItem("authRole") === "user") {
        localStorage.removeItem("authRole");
      }
      this.saveToStorage();
    },
  },
});
