<script>
import { useMainStore } from "@/stores/main";

export default {
    name: "UserRegisterView",
    data() {
        return {
            store: useMainStore(),
            email: "",
            password: "",
            name: "",
            age: "",
            errorMessage: "",
        };
    },

    methods: {
        async register() {
            try {
                console.log("Sending data", {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    age: parseInt(this.age)
                });

                const user = await this.store.registerUser(
                    this.email,
                    this.password,
                    this.name,
                    parseInt(this.age)
                );

                console.log("User created:", user);

                this.$router.push(`/users/${user._id}`);
            } catch (error) {
                console.error("Full error:", error);
                this.errorMessage = error.response?.data || "Registration failed";
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
    input(v-model="password" type="password" placeholder="Password")

    p Name:
    input(v-model="name" placeholder="Name")

    p Age:
    input(v-model="age" type="number" placeholder="Age")

    p(v-if="errorMessage" style="color: red") {{ errorMessage }}

    button(@click="register") Register
</template>
