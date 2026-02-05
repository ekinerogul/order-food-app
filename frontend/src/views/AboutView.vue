<script>
import HelloWorld from "@/components/HelloWorld.vue";
import { useMainStore } from "@/stores/main";

export default {
  name: "AboutView",
  components: {
    HelloWorld,
  },

  data() {
    return {
      store: useMainStore(),
    };
  },

  computed: {
    countAbout() {
      return this.store.countAbout;
    },
  },
};
</script>

<template lang="pug">
.about
  h1 This is an about page
  HelloWorld(
    type="countAbout" 
    :count="countAbout" 
    msg="This is first app!")
</template>
