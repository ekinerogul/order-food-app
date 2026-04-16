<script>
export default {
  name: "RestaurantOrderCard",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    nextStatuses() {
      const flow = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["preparing", "cancelled"],
        preparing: ["delivered", "cancelled"],
        delivered: [],
        cancelled: [],
      };
      return flow[this.order.status] || [];
    },
  },
  methods: {
    updateStatus(newStatus) {
      this.$emit("status-updated", {
        orderId: this.order._id,
        newStatus,
      });
    },
  },
};
</script>

<template lang="pug">
div.restaurant-order-card(style="border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 6px")
  div(style="display: flex; justify-content: space-between; align-items: center")
    strong Order {{ '#' + order._id?.slice(-6) }}
    span.status-badge(:class="'status-' + order.status")
      | {{ order.status }}

  div(v-if="order.user" style="margin-top: 6px; font-size: 13px; color: #666")
    | Customer: {{ order.user.name || order.user.email || 'Unknown' }}

  div(v-if="order.items && order.items.length" style="margin-top: 8px")
    div(v-for="item in order.items" :key="item.foodName" style="font-size: 14px")
      | {{ item.foodName }} x{{ item.quantity }} - {{ item.price * item.quantity }} TL

  div(v-if="order.totalPrice" style="margin-top: 6px; font-weight: bold")
    | Total: {{ order.totalPrice }} TL

  div(v-if="order.address" style="margin-top: 4px; font-size: 13px; color: #666")
    | Delivery: {{ order.address.street }}, {{ order.address.city }}

  div(v-if="nextStatuses.length" style="margin-top: 10px; display: flex; gap: 6px")
    button(
      v-for="status in nextStatuses"
      :key="status"
      @click="updateStatus(status)"
      :class="['status-action', 'status-action-' + status]"
    ) {{ status }}
</template>
