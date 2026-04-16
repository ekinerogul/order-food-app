import { defineStore } from "pinia";
import axios from "axios";

export const useOrderStore = defineStore("order", {
  actions: {
    async orderRestaurant({ restaurantId, items, addressId, token }) {
      try {
        const res = await axios.post(
          "/orders",
          { restaurantId, items, addressId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Order could not be completed";
        throw new Error(message);
      }
    },
  },
});
