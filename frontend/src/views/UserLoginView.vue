<script>
import { useUserStore } from "@/stores/userStore";

export default {
  name: "UserLoginView",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },

  computed: {
    userStore() {
      return useUserStore();
    },
  },

  methods: {
    async login() {
      this.errorMessage = "";

      if (!this.email || !this.password) {
        this.errorMessage = "Email and password are required.";
        return;
      }

      try {
        const user = await this.userStore.loginUser(this.email, this.password);

        this.$router.push(`/users/${user.id || user._id}/dashboard`);
      } catch (error) {
        this.errorMessage = error.message || "Login failed.";
      }
    },
  },
};
</script>

<template lang="pug">
.login
  h1 User Login

  .form
    p Email:
    input(v-model="email" type="email" placeholder="Email" autocomplete="email")

    p Password:
    input(v-model="password" type="password" placeholder="Password" autocomplete="current-password")

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    button(@click="login") Login

  p
    | Don't have an account?&nbsp;
    router-link(to="/users/register") Register here
</template>
