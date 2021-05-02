<template>
  <div class="home">

    <div class="page-header">
      <h1 class="page-title">Orders</h1>
      <div class="actions">
        <a-button icon="filter">Filter</a-button>
        <a-button icon="export">Export</a-button>
        <a-button icon="form">Request Information</a-button>
        <a-button @click="createOrder"
                  icon="plus" type="primary" :loading="isLoading">Add Order
        </a-button>
      </div>
    </div>

    <orders-table :key="reloadOrdersKey" @selected="handleOrderSelected"></orders-table>

    <edit-order-modal v-if="order">
    </edit-order-modal>
  </div>
</template>

<script>
import OrdersTable from "../components/Orders/OrdersTable";
import EditOrderModal from "../components/Orders/EditOrderModal";

import {mapGetters, mapActions} from "vuex";

export default {
  name: 'Orders',
  computed: {
    ...mapGetters('orderEditor', {
      order: 'order',
      reloadOrdersKey: 'reloadOrdersKey',
      isLoading: 'isLoading'
    })
  },
  components: {OrdersTable, EditOrderModal},
  data() {
    return {}
  },
  methods: {
    ...mapActions('orderEditor', {
      loadOrder: 'loadOrder',
      setWizardStage: 'setWizardStage',
      createOrder: 'createOrder'
    }),

    handleOrderSelected(order) {
      this.setWizardStage(0);
      this.loadOrder(
          order.id
      );
    }
  }
}
</script>
