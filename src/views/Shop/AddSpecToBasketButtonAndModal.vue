<template>
  <div class="add-spec-to-basket-button-and-modal" style="display: inline !important">
    <a-button class="add-spec-btn" type="default" icon="plus" @click.prevent="showMethodSelectorModal"></a-button>

    <edit-order-modal v-if="order && type === 'specification'"> </edit-order-modal>

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
          <a-input-search v-model="specificationQuery" placeholder="Search" style="width: 250px" />
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
        @change="handleSpecificationTableChanged"
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
        <!--          <a-button @click.prevent="addSpecificationToBasket(record)">Add</a-button>-->
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
          <a-input-search v-model="orderQuery" placeholder="Search" style="width: 250px" />
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
        @change="handleOrderTableChanged"
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
        <!--          <a-button @click.prevent="addSpecificationToBasket(record)">Add</a-button>-->
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
import EditOrderModal from "../../components/Orders/EditOrderModal";
import { mapActions, mapGetters } from "vuex";
import eventBus from "../../event-bus";

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
  name: "AddSpecToBasketButtonAndModal",
  props: [],
  mixins: [Orders, Dates],
  components: { EditOrderModal },
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
      specificationQuery: "",

      pastOrders: [],
      pastOrdersPagination: {},
      isLoadingPastOrders: false,
      pastOrdersColumns: PAST_ORDERS_COLUMNS,
      selectedPastOrdersIds: [],
      orderQuery: "",

      isExpectingSpecificationToBeAdded: false,
      idOfSpecificationAdded: null,

      isSaving: false,
    };
  },
  computed: {
    ...mapGetters("orderEditor", {
      order: "order",
      type: "type",
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
  created() {
    eventBus.$on("specification-updated", (spec) => {
      if (spec.id === this.idOfSpecificationAdded) {
        this.updateSpecificationInBasket(spec);
      }
    });
  },
  watch: {
    order(updatedSpec) {
      if (updatedSpec) {
        if (this.isExpectingSpecificationToBeAdded) {
          this.idOfSpecificationAdded = updatedSpec.id;
          this.addSpecificationToBasket(updatedSpec);
          this.isExpectingSpecificationToBeAdded = false;
        }
      }
    },

    specificationQuery: function () {
      this.loadSpecifications();
    },

    orderQuery: function () {
      this.loadPastOrders();
    },
  },
  methods: {
    ...mapActions("shop", {
      addPastOrderToBasket: "addPastOrderToBasket",
      addSpecificationToBasket: "addSpecificationToBasket",
      updateSpecificationInBasket: "updateSpecificationInBasket",
    }),

    ...mapActions("orderEditor", {
      createSpecification: "createSpecification",
    }),

    handleSpecificationTableChanged(pagination, filters, sorter) {
      const pager = { ...this.specificationPagination };
      pager.current = pagination.current;
      this.specificationPagination = pager;
      this.loadSpecifications({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },

    handleOrderTableChanged(pagination, filters, sorter) {
      const pager = { ...this.specificationPagination };
      pager.current = pagination.current;
      this.specificationPagination = pager;
      this.loadPastOrders({
        results_per_page: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },

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

    createNewSpecificationAndAddToBasket() {
      this.isExpectingSpecificationToBeAdded = true;
      this.$router.push("/shop/basket");
      this.createSpecification();
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
          q: this.specificationQuery,
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

    addSpecifications() {
      if (this.selectedSpecificationIds.length == 0) {
        return false;
      }
      let vm = this;
      vm.isSaving = true;
      _.each(this.selectedSpecificationIds, (id) => {
        let order = _.find(this.specifications, { id: id });
        if (order) {
          this.addSpecificationToBasket(order);
        }
      });
      vm.isSaving = false;
      vm.savedSpecModalVisible = false;
      vm.$router.push("/shop/basket");
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
          q: this.orderQuery,
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

    addPastOrders() {
      if (this.selectedPastOrdersIds.length == 0) {
        return false;
      }
      let vm = this;
      vm.isSaving = true;
      _.each(this.selectedPastOrdersIds, (id) => {
        let order = _.find(this.pastOrders, { id: id });
        if (order) {
          this.addPastOrderToBasket(order);
        }
      });
      vm.isSaving = false;
      vm.pastOrdersModalVisible = false;
      vm.$router.push("/shop/basket");
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
