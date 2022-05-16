<template>
  <div class="home">
    <loading-screen :is-loading="isLoadingSuppliers || isDeleting"></loading-screen>

    <div class="page-header">
      <h1 class="page-title">Orders</h1>
      <div class="actions">
        <a-input-search placeholder="Search orders" style="width: 200px" v-model="searchQuery" />

        <orders-filters
          @filter-updated="handleFilterUpdated"
          @set-filters="setFilters"
          :filters="filters"
        ></orders-filters>

        <a-button icon="export">Export</a-button>
        <a-button
          icon="form"
          @click="requestInformation"
          :loading="isRequestingInformation"
          :disabled="selectedOrderIds.length == 0"
          >Request Information
        </a-button>
        <a-button @click="createOrder" icon="plus" type="primary" :loading="isLoading">Add Order </a-button>
      </div>
    </div>

    <orders-table
      @set-selected-order-ids="setSelectedOrderIds"
      @delete-order="deleteOrder"
      :search-query="searchQuery"
      :filters="filters"
      :reload-key="reloadOrdersKey"
      @selected="handleOrderSelected"
    ></orders-table>

    <edit-order-modal :suppliers="suppliers" v-if="order && type === 'order'"> </edit-order-modal>
  </div>
</template>

<script>
import OrdersTable from "../components/Orders/OrdersTable";
import EditOrderModal from "../components/Orders/EditOrderModal";
import OrdersFilters from "../components/Orders/OrdersFilters";

import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  name: "Orders",
  computed: {
    ...mapGetters("orderEditor", {
      type: "type",
      order: "order",
      reloadOrdersKey: "reloadOrdersKey",
      isLoading: "isLoading",
    }),
  },
  components: { OrdersTable, EditOrderModal, OrdersFilters },
  data() {
    return {
      suppliers: [],
      isLoadingSuppliers: false,
      isRequestingInformation: false,
      selectedOrderIds: [],
      isDeleting: false,
      searchQuery: "",
      filters: {
        filters_enabled: {},
      },
    };
  },
  created() {
    this.loadSuppliers();
  },
  methods: {
    ...mapActions("orderEditor", {
      loadOrder: "loadOrder",
      setWizardStage: "setWizardStage",
      createOrder: "createOrder",
      incrementReloadOrdersKey: "incrementReloadOrdersKey",
    }),

    setFilters(filters) {
      this.filters = filters;
    },

    loadSuppliers() {
      let vm = this;
      vm.isLoadingSuppliers = true;
      axios
        .get(window.API_BASE + "/suppliers")
        .then((r) => {
          vm.suppliers = r.data;
          vm.isLoadingSuppliers = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingSuppliers = false;
          vm.$message.error("Error loading suppliers");
        });
    },

    requestInformation() {
      let vm = this;

      if (vm.selectedOrderIds.length === 0) {
        return false;
      }

      vm.isRequestingInformation = true;
      axios
        .post(window.API_BASE + "/request-information", {
          ids: vm.selectedOrderIds,
        })
        .then(() => {
          vm.isRequestingInformation = false;
          vm.$message.success("Information requested successfully");
          vm.incrementReloadOrdersKey();
        })
        .catch((e) => {
          console.log(e);
          vm.isRequestingInformation = false;
          this.$message.error("Error requesting information");
        });
    },

    deleteOrder(order) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/orders/" + order.id)
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("Order deleted successfully");
          vm.incrementReloadOrdersKey();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.success("Error deleting order");
        });
    },

    setSelectedOrderIds(ids) {
      this.selectedOrderIds = ids;
    },

    handleOrderSelected(order) {
      this.setWizardStage(0);
      this.loadOrder(order.id);
    },

    handleFilterUpdated() {
      this.incrementReloadOrdersKey();
    },
  },
};
</script>
