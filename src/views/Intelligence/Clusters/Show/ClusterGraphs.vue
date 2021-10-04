<template>
  <div>
    <!-- Graph selector -->
    <a-tabs v-model="activeGraph">
      <a-tab-pane key="orders" tab="Orders"></a-tab-pane>
      <a-tab-pane key="prices" tab="Prices"></a-tab-pane>
      <a-tab-pane key="demand" tab="Demand"></a-tab-pane>
      <a-tab-pane key="product-details" tab="Product Details"></a-tab-pane>
    </a-tabs>
    <!-- / Graph selector -->

    <!-- Card -->
    <a-card>
      <a-row type="flex" :gutter="20">
        <a-col :span="20">
          <!-- Graphs -->
          <div v-if="isLoading" style="text-align: center;">
            <a-spin></a-spin> 
          </div>
          <div v-else>
              <cluster-orders-graph :graph-reload-key="graphReloadKey"
               v-if="activeGraph === 'orders'" :orders="clusterOrders"></cluster-orders-graph>
          </div>
          <!-- / Graphs -->
        </a-col>
        <a-col :span="4">
          <div class="sidebar-wrapper">
              <cluster-stats-sidebar :cluster-id="clusterId"></cluster-stats-sidebar>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <!-- / Card -->
  </div>
</template>

<script>
import ClusterStatsSidebar from "./ClusterGraphs/ClusterStatsSidebar.vue";
import axios from 'axios';
import ClusterOrdersGraph from './ClusterGraphs/ClusterOrdersGraph.vue';
export default {
  props: ["clusterId", "graphReloadKey"],
  components: {ClusterStatsSidebar, ClusterOrdersGraph},
  data() {
    return {
      activeGraph: "orders",

      isLoading: false,
      clusterOrders: []
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/intelligence/clusters/' + this.clusterId + '/orders-with-matches').then(r => {
        vm.clusterOrders = r.data;
        vm.isLoading = false;
      }).catch(e => {
        console.log(e);
        vm.$message.error('Error loading cluster orders');
      });
    }
  }
};
</script>

<style scoped>
.sidebar-wrapper {
  border-left: 1px solid #eee;
  height: 100%;
}
</style>