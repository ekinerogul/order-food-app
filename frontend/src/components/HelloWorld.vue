<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
    type: String,
    count: Number,
  },

  data() {
    return {
      store: useMainStore(),
    };
  },

  methods: {
    increment(type) {
      this.store.increment(type);
    },
    decrement(type) {
      this.store.decrement(type);
    },
  },
};
</script>

<template lang="pug">
.hello 
  p {{ msg }}
  .counter {{ count }}
  button.increment(@click="increment(type)") Increment
  button.decrement(@click="decrement(type)") Decrement
</template>

<style scoped lang="scss"></style>
