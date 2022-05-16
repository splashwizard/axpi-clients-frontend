<template>
  <div style="display: inline !important">
    <a-button type="primary" icon="plus" @click.prevent="showMethodSelectorModal">Add Specifications</a-button>

    <a-modal
      title="Add Specifications"
      :visible="methodSelectorModalVisible"
      @cancel="handleMethodSelectorCancel"
      :footer="false"
    >
      <div class="icon-selector">
        <a href="#" @click.prevent="selectMethod('past-orders')">
          <div class="icon">
            <a-icon type="dropbox" style="font-size: 30px; color: #97bbf1"></a-icon>
          </div>
          <div class="caption">Past Order</div>
        </a>
        <a href="#" @click.prevent="selectMethod('saved')">
          <div class="icon">
            <a-icon type="heart" style="font-size: 30px; color: #97bbf1"></a-icon>
          </div>
          <div class="caption">Saved</div>
        </a>
        <a href="#" @click.prevent="selectMethod('create-new')">
          <div class="icon">
            <a-icon type="plus" style="font-size: 30px; color: #97bbf1"></a-icon>
          </div>
          <div class="caption">Create New</div>
        </a>
      </div>
    </a-modal>

    <a-modal
      :width="1200"
      title="Add Specifications"
      :visible="savedSpecModalVisible"
      :centered="true"
      @cancel="handleSavedSpecCancel"
      :footer="false"
    >
      <div class="toolbar">
        <div class="left">
          <a-input-search placeholder="Search" style="width: 250px" />
        </div>
        <div class="right">
          <!--          <a-button icon="filter">Filter</a-button>-->
        </div>
      </div>

      <!--      <div class="loading-screen" v-if="isLoading">-->
      <!--        <a-spin/>-->
      <!--      </div>-->
      <loading-screen :is-loading="isSaving"></loading-screen>

      <a-table
        class="axpi-table"
        :row-selection="specificationRowSelection"
        :columns="specificationColumns"
        :row-key="(record) => record.id"
        :data-source="specifications"
        :pagination="specificationPagination"
        :loading="isLoadingSpecifications"
      >
        <div slot="type" slot-scope="type">
          {{ formatType(type) }}
        </div>
        <div slot="subtype" slot-scope="subtype">
          {{ formatSubtype(subtype) }}
        </div>
        <div slot="date" slot-scope="date">
          {{ displayTimeAgo(date) }}
        </div>
        <!--        <div slot="actions" slot-scope="name, record" class="table-actions">-->
        <!--          <a-button @click.prevent="addSpecificationToOptimisation(record)">Add</a-button>-->
        <!--        </div>-->
      </a-table>

      <div>
        <div class="actions text-right">
          <a-button
            type="primary"
            icon="plus"
            :disabled="selectedSpecificationIds.length == 0"
            @click="addSpecifications"
            >Add Specifications
          </a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      :width="1200"
      title="Add From Past Orders"
      :centered="true"
      :visible="pastOrdersModalVisible"
      @cancel="handlePastOrdersCancel"
      :footer="false"
    >
      <div class="toolbar">
        <div class="left">
          <a-input-search placeholder="Search" style="width: 250px" />
        </div>
        <div class="right">
          <a-button icon="filter">Filter</a-button>
        </div>
      </div>

      <!--      <div class="loading-screen" v-if="isLoading">-->
      <!--        <a-spin/>-->
      <!--      </div>-->
      <loading-screen :is-loading="isSaving"></loading-screen>

      <a-table
        class="axpi-table"
        :row-selection="pastOrdersRowSelection"
        :columns="pastOrdersColumns"
        :row-key="(record) => record.id"
        :data-source="pastOrders"
        :pagination="pastOrdersPagination"
        :loading="isLoadingPastOrders"
      >
        <div slot="type" slot-scope="type">
          {{ formatType(type) }}
        </div>
        <div slot="subtype" slot-scope="subtype">
          {{ formatSubtype(subtype) }}
        </div>
        <div slot="quantity" slot-scope="quantity">
          {{ formatQuantity(quantity) }}
        </div>
        <div slot="date" slot-scope="date">
          {{ displayTimeAgo(date) }}
        </div>
        <!--        <div slot="actions" slot-scope="name, record" class="table-actions">-->
        <!--          <a-button @click.prevent="addSpecificationToOptimisation(record)">Add</a-button>-->
        <!--        </div>-->
      </a-table>

      <div>
        <div class="actions text-right">
          <a-button type="primary" icon="plus" :disabled="selectedPastOrdersIds.length == 0" @click="addPastOrders"
            >Add Specifications
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../mixins/Orders";
import Dates from "../../mixins/Dates";
import { mapGetters, mapActions } from "vuex";

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
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Subtype",
    dataIndex: "product_subtype",
    sorter: true,
    scopedSlots: { customRender: "subtype" },
  },
  // {
  //   title: 'Quantity',
  //   dataIndex: 'quantity',
  //   sorter: true,
  //   scopedSlots: {customRender: 'quantity'}
  // },
  {
    title: "Last Updated",
    dataIndex: "updated_at",
    sorter: true,
    scopedSlots: { customRender: "date" },
  },
];

const PAST_ORDERS_COLUMNS = [
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
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Subtype",
    dataIndex: "product_subtype",
    sorter: true,
    scopedSlots: { customRender: "subtype" },
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    sorter: true,
    scopedSlots: { customRender: "quantity" },
  },
  {
    title: "Last Updated",
    dataIndex: "updated_at",
    sorter: true,
    scopedSlots: { customRender: "date" },
  },
];

export default {
  name: "AddSpecificationToOptimisationButtonAndModal",
  props: ["optimisation"],
  mixins: [Orders, Dates],
  data() {
    return {
      serverErrors: [],

      methodSelectorModalVisible: false,

      savedSpecModalVisible: false,
      pastOrdersModalVisible: false,

      specifications: [],
      specificationPagination: {},
      isLoadingSpecifications: false,
      specificationColumns: SPECIFICATION_COLUMNS,
      selectedSpecificationIds: [],

      pastOrders: [],
      pastOrdersPagination: {},
      isLoadingPastOrders: false,
      pastOrdersColumns: PAST_ORDERS_COLUMNS,
      selectedPastOrdersIds: [],

      isSaving: false,

      specification: null,

      shouldAddNextSpecification: false,
    };
  },
  watch: {
    order(newVal) {
      let vm = this;
      if (newVal && this.shouldAddNextSpecification) {
        alert("add spec");
        vm.shouldAddNextSpecification = false;
      }
    },
  },
  computed: {
    ...mapGetters("orderEditor", {
      order: "order",
    }),

    isLoading() {
      return this.isLoadingSpecifications || this.isLoadingPastOrders;
    },

    specificationRowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedSpecificationIds = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },

    pastOrdersRowSelection() {
      return {
        onChange: (selectedRowKeys) => {
          this.selectedPastOrdersIds = selectedRowKeys;
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.name === "Disabled User", // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
  methods: {
    ...mapActions("orderEditor", {
      createSpecification: "createSpecification",
    }),

    selectMethod(method) {
      this.methodSelectorModalVisible = false;
      if (method === "saved") {
        this.showSavedSpecModal();
      }
      if (method === "past-orders") {
        this.showPastOrdersModal();
      }
      if (method === "create-new") {
        this.createNewSpecificationAndAddToBasket();
      }
    },

    showMethodSelectorModal() {
      this.methodSelectorModalVisible = true;
    },

    handleMethodSelectorCancel() {
      this.methodSelectorModalVisible = false;
    },

    // Saved Specifications
    showSavedSpecModal() {
      this.savedSpecModalVisible = true;
      this.loadSpecifications();
    },

    handleSavedSpecCancel() {
      this.savedSpecModalVisible = false;
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

    addSpecifications() {
      if (this.selectedSpecificationIds.length == 0) {
        return false;
      }
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/create-from-specifications", {
          specification_ids: vm.selectedSpecificationIds,
        })
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Specifications added successfully");
          vm.$emit("refresh-optimisation");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding specifications");
        });
    },

    // Past Orders
    showPastOrdersModal() {
      this.pastOrdersModalVisible = true;
      this.loadPastOrders();
    },

    handlePastOrdersCancel() {
      this.pastOrdersModalVisible = false;
    },

    loadPastOrders(params = {}) {
      let vm = this;
      vm.isLoadingPastOrders = true;
      axios
        .post(window.API_BASE + "/orders/search", {
          results_per_page: 10,
          ...params,
        })
        .then((r) => {
          const pagination = { ...this.pastOrdersPagination };
          // Read total count from server
          pagination.total = r.data.total;
          this.isLoadingPastOrders = false;
          this.pastOrders = r.data.data;
          this.pastOrdersPagination = pagination;
        })
        .catch((e) => {
          vm.$message.error("Error loading past orders");
          vm.isLoadingPastOrders = false;
          let errors;
          if (typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },

    addPastOrderToOptimisation(pastOrder) {
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/create-from-past-order", {
          order_id: pastOrder.id,
        })
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Past order added successfully");
          vm.$emit("refresh-optimisation");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding past order");
        });
    },

    addPastOrders() {
      if (this.selectedPastOrdersIds.length == 0) {
        return false;
      }
      let vm = this;
      vm.isSaving = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisation.id + "/create-from-orders", {
          order_ids: vm.selectedPastOrdersIds,
        })
        .then(() => {
          vm.isSaving = false;
          vm.$message.success("Orders added successfully");
          vm.$emit("refresh-optimisation");
        })
        .catch((e) => {
          console.log(e);
          vm.isSaving = false;
          vm.$message.error("Error adding orders");
        });
    },

    createNewSpecificationAndAddToBasket() {
      this.shouldAddNextSpecification = true;
      this.createSpecification();
      this.methodSelectorModalVisible = false;
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

.method-selector {
  margin-bottom: 15px;
}

.icon-selector a {
  flex: 1;
}

.icon-selector .icon {
  margin-left: auto;
  margin-right: auto;
}

.icon-selector .caption {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.icon-selector a:hover .icon {
  background: #5d9cf4 !important;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
}

.toolbar .left {
  flex: 1;
}

.toolbar .right {
  flex-shrink: 1;
}
</style>
