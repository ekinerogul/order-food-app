<script>
export default {
  name: "HomeView",
};
</script>

<template lang="pug">
.home
  h1 Welcome to Order Food App

  div.section
    h2 I am a Customer
    div.links
      router-link.btn(to="/users/register") Register
      | &nbsp;or&nbsp;
      router-link.btn(to="/users/login") Login

  div.section
    h2 I am a Restaurant
    div.links
      router-link.btn(to="/restaurants/register") Register
      | &nbsp;or&nbsp;
      router-link.btn(to="/restaurants/login") Login
</template>
