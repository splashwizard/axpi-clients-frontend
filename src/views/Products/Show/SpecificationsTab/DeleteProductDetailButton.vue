<template>
  <a-popover v-model="visible" placement="topRight" trigger="click">
    <template slot="title">
      <div class="filter-title-wrapper">
        <div class="center">Are you sure you want to delete?</div>
      </div>
    </template>
    <template slot="content">
      <div class="popover-inner popconfirm">
        <a-button :disabled="isDeleting" @click="visible = false" size="small" style="margin-right: 10px"
          >Cancel</a-button
        >
        <a-button :disabled="isDeleting" @click.prevent="deleteProperty" type="danger" size="small">Delete</a-button>
      </div>
    </template>
    <a-button :disabled="isDeleting" size="small" icon="delete" type="danger"></a-button>
  </a-popover>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "DeleteProductDetailButton",
  props: ["product", "details"],
  data() {
    return {
      visible: false,
      isDeleting: false,
    };
  },
  methods: {
    ...mapActions("productViewer", {
      loadDetails: "loadDetails",
    }),

    deleteProperty() {
      let vm = this;

      if (vm.isDeleting) {
        return false;
      }

      vm.isDeleting = true;
      axios
        .post(window.API_BASE + "/products/" + this.product["_id"] + "/delete-detail", {
          propertyName: vm.details.propertyName,
          normalisedUnitMagnitude: vm.details.normalisedUnitMagnitude,
          normalisedUnitBase: vm.details.normalisedUnitBase,
          inequality: vm.details.inequality,
        })
        .then(() => {
          vm.isDeleting = false;
          vm.visible = false;
          vm.$message.success("Property deleted successfully");
          vm.loadDetails();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.error("Error deleting property");
        });
    },
  },
};
</script>

<style scoped></style>
