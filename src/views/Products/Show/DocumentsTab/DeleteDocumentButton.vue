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
        <a-button :disabled="isDeleting" @click.prevent="deleteDocument" type="danger" size="small">Delete</a-button>
      </div>
    </template>
    <a-button :disabled="isDeleting" size="small" icon="delete" type="danger"></a-button>
  </a-popover>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";
export default {
  name: "DeleteDocumentButton",
  props: ["product", "document"],
  data() {
    return {
      visible: false,
      isDeleting: false,
    };
  },
  methods: {
    ...mapActions("productViewer", {
      loadDocuments: "loadDocuments",
    }),

    deleteDocument() {
      let vm = this;

      if (vm.isDeleting) {
        return false;
      }

      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/products/" + this.product["productCode"] + "/documents/" + this.document["_id"])
        .then(() => {
          vm.isDeleting = false;
          vm.visible = false;
          vm.$message.success("Document deleted successfully");
          vm.loadDocuments();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.error("Error deleting document");
        });
    },
  },
};
</script>

<style scoped></style>
