<template>
  <div>
    <a-button type="primary" icon="plus" @click.prevent="showModal">Add Specification</a-button>

    <a-modal title="Add Specification" :visible="visible" @cancel="handleCancel" :footer="false">
      <!--      <div class="loading-screen" v-if="isLoading">-->
      <!--        <a-spin/>-->
      <!--      </div>-->
      <loading-screen :is-loading="isSaving"></loading-screen>

      <a-table
        class="axpi-table"
        :columns="specificationColumns"
        :row-key="(record) => record.id"
        :data-source="specifications"
        :pagination="specificationPagination"
        :loading="isLoadingSpecifications"
      >
        <div slot="actions" slot-scope="name, record" class="table-actions">
          <a-button @click.prevent="addSpecificationToOptimisation(record)">Add</a-button>
        </div>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
const _ = require("lodash");

const SPECIFICATION_COLUMNS = [
  {
    title: "Name",
    dataIndex: "product_name",
    sorter: true,
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Type",
    dataIndex: "product_type",
    sorter: true,
  },
  {
    title: "",
    scopedSlots: { customRender: "actions" },
    width: 10,
  },
];

export default {
  name: "AddSpecificationToOptimisationButtonAndModal",
  props: ["optimisation"],
  data() {
    return {
      visible: false,
      serverErrors: [],

      specifications: [],
      specificationPagination: {},
      isLoadingSpecifications: false,
      specificationColumns: SPECIFICATION_COLUMNS,
      isSaving: false,
    };
  },
  computed: {
    isLoading() {
      return this.isLoadingSpecifications;
    },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.loadSpecifications();
    },

    handleCancel() {
      this.visible = false;
    },

    loadSpecifications(params = {}) {
      let vm = this;
      vm.isLoadingSpecifications = true;
      axios
        .post(window.API_BASE + "/specifications/search", {
          results_per_page: 10,
          ...params,
        })
        .then((r) => {
          const pagination = { ...this.specificationPagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.isLoadingSpecifications = false;
          this.specifications = r.data.data;
          this.specificationPagination = pagination;
        })
        .catch((e) => {
          vm.$message.error("Error loading specifications");
          vm.isLoadingSpecifications = false;
          let errors;
          if (typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },

    addSpecificationToOptimisation(specification) {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/create-from-specification", {
          specification_id: specification.id,
        })
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Specification added successfully");
          vm.$emit("refresh-optimisation");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding specification");
        });
    },
  },
};
</script>

<style scoped>
.loading-screen {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 70px;
}
</style>
