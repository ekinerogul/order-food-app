<script>
export default {
  name: "OrderCard",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template lang="pug">
div.order-card(style="border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 6px")
  div(style="display: flex; justify-content: space-between; align-items: center")
    strong Order {{ '#' + order._id?.slice(-6) }}
    span.status-badge(:style="{ color: order.status === 'delivered' ? '#27ae60' : order.status === 'cancelled' ? '#e74c3c' : '#f39c12' }")
      | {{ order.status }}

  div(v-if="order.items && order.items.length" style="margin-top: 8px")
    div(v-for="item in order.items" :key="item.foodName" style="font-size: 14px")
      | {{ item.foodName }} x{{ item.quantity }} - {{ item.price * item.quantity }} TL

  div(v-if="order.totalPrice" style="margin-top: 6px; font-weight: bold")
    | Total: {{ order.totalPrice }} TL

  div(v-if="order.address" style="margin-top: 4px; font-size: 13px; color: #666")
    | Delivery: {{ order.address.street }}, {{ order.address.city }}
</template>
