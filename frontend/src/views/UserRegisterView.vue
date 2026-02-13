<script>
import { useUserStore } from "@/stores/userStore";

export default {
  name: "UserRegisterView",
  data() {
    return {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      age: "",
      errorMessage: "",
    };
  },

  computed: {
    userStore() {
      return useUserStore();
    },
  },

  methods: {
    async register() {
      this.errorMessage = "";

      if (!this.email || !this.password || !this.name || !this.age) {
        this.errorMessage = "All fields are required.";
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "The password must be at least 6 characters long.";
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      if (this.name.length < 2) {
        this.errorMessage = "The name must be at least 2 characters long.";
        return;
      }

      const ageNum = Number(this.age);
      if (isNaN(ageNum) || ageNum < 18) {
        this.errorMessage = "You must be at least 18 years old.";
        return;
      }

      try {
        const user = await this.userStore.registerUser(
          this.email,
          this.password,
          this.name,
          ageNum,
        );

        this.$router.push(`/users/${user.id || user._id}/dashboard`);
      } catch (error) {
        this.errorMessage = error.message || "Registration failed.";
      }
    },
  },
};
</script>

<template lang="pug">
.register
  h1 User Registration

  .form
    p Email:
    input(v-model="email" type="email" placeholder="Email")

    p Password:
    input(v-model="password" type="password" placeholder="Password (min 6 chars)")

    p Confirm Password:
    input(v-model="passwordConfirm" type="password" placeholder="Confirm Password")

    p Name:
    input(v-model="name" placeholder="Name (min 2 chars)")

    p Age:
    input(v-model="age" type="number" placeholder="Age (min 18)")

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    button(@click="register") Register

  p
    | Already have an account?&nbsp;
    router-link(to="/users/login") Login here
</template>
