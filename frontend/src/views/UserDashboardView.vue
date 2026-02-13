<script>
import { useUserStore } from "@/stores/userStore";
import AddressForm from "@/components/AddressForm.vue";
import OrderCard from "@/components/OrderCard.vue";

export default {
  name: "UserDashboardView",
  props: ["userId"],
  components: {
    AddressForm,
    OrderCard,
  },
  data() {
    return {
      isLoading: true,
      user: null,
      selectedAddressId: "",
      editingName: false,
      editName: "",
      editingEmail: false,
      editEmail: "",
      errorMessage: "",
      successMessage: "",
    };
  },

  computed: {
    userStore() {
      return useUserStore();
    },
  },

  async mounted() {
    await this.loadUser();
    this.isLoading = false;
  },

  methods: {
    showSuccess(msg) {
      this.successMessage = msg;
      setTimeout(() => (this.successMessage = ""), 3000);
    },

    async loadUser() {
      try {
        this.user = await this.userStore.fetchUser();
        this.userStore.currentUser = this.user;
        this.userStore.saveToStorage();

        const defaultAddress = this.user.addresses?.find((a) => a.isDefault);
        if (defaultAddress) {
          this.selectedAddressId = defaultAddress._id;
        } else if (this.user.addresses?.length > 0) {
          this.selectedAddressId = this.user.addresses[0]._id;
        }
      } catch (error) {
        this.errorMessage = "Failed to load user data.";
      }
    },

    async addAddress(address) {
      this.errorMessage = "";

      try {
        await this.userStore.addAddress(address);
        this.showSuccess("Address added successfully!");
        await this.loadUser();
      } catch (error) {
        this.errorMessage = error.message || "Failed to add address.";
      }
    },

    async removeAddress(addressId) {
      if (!confirm("Are you sure you want to remove this address?")) return;

      this.errorMessage = "";

      try {
        await this.userStore.removeAddress(addressId);
        this.showSuccess("Address removed.");
        await this.loadUser();
      } catch (error) {
        this.errorMessage = error.message || "Failed to remove address.";
      }
    },

    startEditName() {
      this.editName = this.user.name;
      this.editingName = true;
    },

    async saveName() {
      this.errorMessage = "";

      if (!this.editName || this.editName.length < 2) {
        this.errorMessage = "Name must be at least 2 characters.";
        return;
      }

      try {
        await this.userStore.updateName(this.editName);
        this.editingName = false;
        this.showSuccess("Name updated.");
        await this.loadUser();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update name.";
      }
    },

    startEditEmail() {
      this.editEmail = this.user.email;
      this.editingEmail = true;
    },

    async saveEmail() {
      this.errorMessage = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.editEmail)) {
        this.errorMessage = "Please enter a valid email address.";
        return;
      }

      try {
        await this.userStore.updateEmail(this.editEmail);
        this.editingEmail = false;
        this.showSuccess("Email updated.");
        await this.loadUser();
      } catch (error) {
        this.errorMessage = error.message || "Failed to update email.";
      }
    },

    goToOrder() {
      if (!this.selectedAddressId) {
        this.errorMessage = "Please select an address first.";
        return;
      }

      this.$router.push({
        name: "create-order",
        params: { userId: this.userId },
        query: { addressId: this.selectedAddressId },
      });
    },

    logout() {
      this.userStore.logout();
      this.$router.push("/users/login");
    },
  },
};
</script>

<template lang="pug">
.dashboard
  p(v-if="isLoading") Loading...

  div(v-else-if="user")
    div.header-row
      h1 Welcome, {{ user.name }}!
      button.logout-btn(@click="logout") Logout

    div
      div(v-if="!editingName")
        | Name: {{ user.name }}&nbsp;
        button(@click="startEditName") Edit
      div(v-else)
        input(v-model="editName" placeholder="New name")
        button(@click="saveName") Save
        button(@click="editingName = false") Cancel

    div
      div(v-if="!editingEmail")
        | Email: {{ user.email }}&nbsp;
        button(@click="startEditEmail") Edit
      div(v-else)
        input(v-model="editEmail" type="email" placeholder="New email")
        button(@click="saveEmail") Save
        button(@click="editingEmail = false") Cancel

    p Age: {{ user.age }}

    p.error-msg(v-if="errorMessage") {{ errorMessage }}
    p.success-msg(v-if="successMessage") {{ successMessage }}

    h2 My Addresses

    div(v-if="user.addresses && user.addresses.length")
      div.address-item(v-for="address in user.addresses" :key="address._id")
        label
          input(
            type="radio"
            v-model="selectedAddressId"
            :value="address._id"
          )
          | &nbsp;{{ address.street }}, {{ address.city }}
          span(v-if="address.zipCode") &nbsp;- {{ address.zipCode }}
          span(v-if="address.details") &nbsp;({{ address.details }})
          span(v-if="address.isDefault") &nbsp;(Default)
        button(@click="removeAddress(address._id)") Remove

    div(v-else)
      p.warning-msg No addresses yet. Please add one to start ordering.

    h3 Add New Address
    AddressForm(:showDetails="true" @submit="addAddress")

    h2 Order Food
    div(v-if="user.addresses && user.addresses.length")
      button.order-btn(
        :disabled="!selectedAddressId"
        @click="goToOrder"
      ) Go to Restaurants and Order

    div(v-else)
      p.warning-msg You must add an address before you can order!

    h2 My Orders

    div(v-if="user.orders && user.orders.length")
      OrderCard(
        v-for="order in user.orders"
        :key="order._id"
        :order="order"
      )

    div(v-else)
      p No orders yet.
</template>
