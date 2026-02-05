<script>
import { useMainStore } from "@/stores/main";

export default {
  name: "UsersView",
  data() {
    return {
      isLoading: true,
      store: useMainStore(),
    };
  },

  async mounted() {
    await this.store.fetchUsers();
    this.isLoading = false;
  },
  computed: {
    users() {
      return this.store.users;
    },
    restaurants() {
      return this.store.restaurants;
    },
  },
};
</script>

<template lang="pug">
  .home
    h1 Users
    p(v-if="isLoading") Please wait...
    div(v-else)
      p There are {{users.length}} users waiting.

      ol
        li(v-for="user in users" :key="user._id")
          a(:href="`/users/${user._id}`") {{ user.name }}
</template>
