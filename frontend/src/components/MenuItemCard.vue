<script>
export default {
  name: "MenuItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEditing: false,
      editName: "",
      editPrice: "",
      editCategory: "",
    };
  },
  methods: {
    startEdit() {
      this.editName = this.item.name;
      this.editPrice = this.item.price;
      this.editCategory = this.item.category || "";
      this.isEditing = true;
    },

    saveEdit() {
      const updateData = {};

      if (this.editName !== this.item.name) updateData.name = this.editName;
      if (Number(this.editPrice) !== this.item.price)
        updateData.price = Number(this.editPrice);
      if (this.editCategory !== (this.item.category || ""))
        updateData.category = this.editCategory;

      if (Object.keys(updateData).length === 0) {
        this.isEditing = false;
        return;
      }

      this.$emit("update", { foodId: this.item._id, updateData });
      this.isEditing = false;
    },

    cancelEdit() {
      this.isEditing = false;
    },
  },
};
</script>

<template lang="pug">
div.menu-item-card(style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee")
  div(v-if="!isEditing")
    strong {{ item.name }}
    span(style="color: #666; margin-left: 8px") {{ item.price }} TL
    span(v-if="item.category" style="color: #999; margin-left: 8px; font-size: 12px")
      | ({{ item.category }})

  div(v-else)
    input(v-model="editName" placeholder="Name" style="margin-right: 4px")
    input(v-model="editPrice" type="number" placeholder="Price" style="width: 80px; margin-right: 4px")
    input(v-model="editCategory" placeholder="Category" style="margin-right: 4px")

  div(v-if="editable")
    div(v-if="!isEditing")
      button(@click="startEdit" style="margin-right: 4px") Edit
      button(@click="$emit('remove', item._id)") Remove
    div(v-else)
      button(@click="saveEdit" style="margin-right: 4px") Save
      button(@click="cancelEdit") Cancel
</template>
