<script>
export default {
  name: "AddressForm",
  props: {
    showDetails: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      street: "",
      city: "",
      zipCode: "",
      details: "",
    };
  },
  methods: {
    submit() {
      if (!this.street || !this.city) return;

      const address = {
        street: this.street,
        city: this.city,
      };

      if (this.zipCode) address.zipCode = this.zipCode;
      if (this.details) address.details = this.details;

      this.$emit("submit", address);

      this.street = "";
      this.city = "";
      this.zipCode = "";
      this.details = "";
    },
  },
};
</script>

<template lang="pug">
div.address-form
  p Street:
  input(v-model="street" placeholder="Street (required)")

  p City:
  input(v-model="city" placeholder="City (required)")

  p Zip Code (optional):
  input(v-model="zipCode" placeholder="Zip Code")

  div(v-if="showDetails")
    p Details (optional):
    input(v-model="details" placeholder="Apartment, floor, etc.")

  button(@click="submit") Add Address
</template>
