import { defineStore } from "pinia";
import { useUserStore } from "./userStore";
import { useOrderStore } from "./orderStore";

export const useMainStore = defineStore("main", {
  actions: {
    async createOrderFlow({ restaurantId, items, addressId }) {
      const userStore = useUserStore();
      const orderStore = useOrderStore();

      if (!userStore.currentUser) {
        throw new Error("You must log in to place an order.");
      }

      const userAddress = userStore.currentUser.addresses.find(
        (a) => a._id === addressId
      );

      if (!userAddress) {
        throw new Error("Invalid address selection.");
      }

      return await orderStore.orderRestaurant({
        restaurantId,
        items,
        addressId: userAddress._id,
        token: userStore.token,
      });
    },
  },
});
