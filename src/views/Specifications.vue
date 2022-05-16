<template>
  <div class="specifications">
    <loading-screen :is-loading="isDeleting"></loading-screen>

    <div class="page-header">
      <h1 class="page-title">Specifications</h1>
      <div class="actions">
        <a-button @click="createSpecification" icon="plus" type="primary" :loading="isLoading"
          >Add Specification
        </a-button>
      </div>
    </div>

    <specifications-table
      @set-selected-specification-ids="setSelectedSpecificationIds"
      @delete-specification="deleteSpecification"
      :reload-key="reloadOrdersKey"
      @selected="handleSpecificationSelected"
    ></specifications-table>

    <edit-order-modal v-if="order && type === 'specification'"> </edit-order-modal>
  </div>
</template>

<script>
import SpecificationsTable from "../components/Specifications/SpecificationsTable";
import EditOrderModal from "../components/Orders/EditOrderModal";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
export default {
  name: "Specifications",
  computed: {
    ...mapGetters("orderEditor", {
      type: "type",
      order: "order",
      reloadOrdersKey: "reloadOrdersKey",
      isLoading: "isLoading",
    }),
  },
  components: { SpecificationsTable, EditOrderModal },
  data() {
    return {
      selectedSpecificationIds: [],
      isDeleting: false,
    };
  },
  methods: {
    ...mapActions("orderEditor", {
      loadSpecification: "loadSpecification",
      setWizardStage: "setWizardStage",
      createSpecification: "createSpecification",
      incrementReloadOrdersKey: "incrementReloadOrdersKey",
    }),

    deleteSpecification(specification) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/specifications/" + specification.id)
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("Specification deleted successfully");
          vm.incrementReloadOrdersKey();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.success("Error deleting order");
        });
    },

    setSelectedSpecificationIds(ids) {
      this.selectedSpecificationIds = ids;
    },

    handleSpecificationSelected(specification) {
      this.setWizardStage(0);
      this.loadSpecification(specification.id);
    },
  },
};
</script>

<style scoped></style>
