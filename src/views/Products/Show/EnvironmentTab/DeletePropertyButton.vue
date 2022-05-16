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
          >Cancel
        </a-button>
        <a-button :disabled="isDeleting" @click.prevent="() => deleteProperty()" type="danger" size="small"
          >Delete
        </a-button>
      </div>
    </template>
    <a-button :disabled="isDeleting" size="small" icon="delete" type="danger"></a-button>
  </a-popover>
</template>

<script>
import axios from "axios";

export default {
  name: "DeletePropertyButton",
  props: ["type", "id", "productId"],
  data() {
    return {
      isDeleting: false,
      visible: false,
    };
  },
  methods: {
    deleteProperty() {
      let vm = this;
      vm.isDeleting = true;

      if (this.type === "Materials") {
        axios
          .delete(window.API_BASE + "/products/" + this.productId + "/esg/materials/" + this.id)
          .then(() => {
            vm.isDeleting = false;
            vm.$message.success("Material deleted successfully");
            vm.$emit("material-deleted");
          })
          .catch((e) => {
            console.log(e);
            vm.isDeleting = false;
            vm.$message.error("Error deleting material");
          });
      }

      if (this.type === "Certifications") {
        axios
          .delete(window.API_BASE + "/products/" + this.productId + "/esg/certifications/" + this.id)
          .then(() => {
            vm.isDeleting = false;
            vm.$message.success("Certification deleted successfully");
            vm.$emit("certification-deleted");
          })
          .catch((e) => {
            console.log(e);
            vm.isDeleting = false;
            vm.$message.error("Error deleting certification");
          });
      }

      if (this.type === "Transport" || this.type === "Transportation") {
        axios
          .delete(window.API_BASE + "/products/" + this.productId + "/esg/transportations/" + this.id)
          .then(() => {
            vm.isDeleting = false;
            vm.$message.success("Transport deleted successfully");
            vm.$emit("transportation-deleted");
          })
          .catch((e) => {
            console.log(e);
            vm.isDeleting = false;
            vm.$message.error("Error deleting transportation");
          });
      }
    },
  },
};
</script>

<style scoped></style>
