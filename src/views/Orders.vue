<template>
  <div class="home">
    <loading-screen :is-loading="isLoadingSuppliers"></loading-screen>

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

    <orders-table :reload-key="reloadOrdersKey" @selected="handleOrderSelected"></orders-table>

    <edit-order-modal :suppliers="suppliers" v-if="order">
    </edit-order-modal>
  </div>
</template>

<script>
import OrdersTable from "../components/Orders/OrdersTable";
import EditOrderModal from "../components/Orders/EditOrderModal";

import {mapGetters, mapActions} from "vuex";
import axios from 'axios';

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
    return {
      suppliers: [],
      isLoadingSuppliers: false
    }
  },
  created() {
    this.loadSuppliers();
  },
  methods: {
    ...mapActions('orderEditor', {
      loadOrder: 'loadOrder',
      setWizardStage: 'setWizardStage',
      createOrder: 'createOrder'
    }),

    loadSuppliers() {
      let vm = this;
      vm.isLoadingSuppliers = true;
      axios.get(window.API_BASE + '/suppliers').then(r => {
        vm.suppliers = r.data;
        vm.isLoadingSuppliers = false;
      }).catch(e => {
        console.log(e);
        vm.isLoadingSuppliers = false;
        vm.$message.error('Error loading suppliers');
      });
    },

    handleOrderSelected(order) {
      this.setWizardStage(0);
      this.loadOrder(
          order.id
      );
    }
  }
}
</script>
