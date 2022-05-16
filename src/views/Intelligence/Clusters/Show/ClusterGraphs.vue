<template>
  <div class="cluster-graphs">
    <!-- Graph selector -->
    <a-tabs v-model="active_graph">
      <a-tab-pane key="orders" tab="Orders"></a-tab-pane>
      <!--      <a-tab-pane key="prices" tab="Prices"></a-tab-pane>-->
      <a-tab-pane key="demand" tab="Demand"></a-tab-pane>
      <a-tab-pane key="product-details" tab="Product Details"> </a-tab-pane>
    </a-tabs>
    <!-- / Graph selector -->

    <!-- Card -->
    <a-card v-if="activeGraph !== 'product-details'">
      <a-row type="flex" :gutter="20">
        <a-col :span="19">
          <!-- Graphs -->
          <div v-if="isLoading" style="text-align: center">
            <a-spin></a-spin>
          </div>
          <div v-else>
            <cluster-orders-graph
              :graph-reload-key="graphReloadKey"
              v-if="activeGraph === 'orders'"
              :orders="ordersWithMatchesFiltered"
            ></cluster-orders-graph>

            <cluster-demand-graph
              :graph-reload-key="graphReloadKey"
              v-if="activeGraph === 'demand'"
              :orders="ordersWithMatchesFiltered"
            ></cluster-demand-graph>
          </div>
          <!-- / Graphs -->
        </a-col>
        <a-col :span="5">
          <div class="sidebar-wrapper">
            <cluster-stats-sidebar :cluster-id="clusterId"></cluster-stats-sidebar>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <!-- / Card -->

    <!-- Table -->
    <div v-if="activeGraph === 'product-details'">
      <div v-if="isLoading" style="text-align: center">
        <a-spin></a-spin>
      </div>
      <all-product-details-table v-if="activeGraph === 'product-details'"></all-product-details-table>
    </div>
    <!-- / Table -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ClusterStatsSidebar from "./ClusterGraphs/ClusterStatsSidebar.vue";
// import axios from 'axios';
import ClusterOrdersGraph from "./ClusterGraphs/ClusterOrdersGraph.vue";
import ClusterDemandGraph from "./ClusterGraphs/ClusterDemandGraph";
import AllProductDetailsTable from "./ClusterGraphs/AllProductDetailsTable";

export default {
  props: ["clusterId", "graphReloadKey"],
  components: { AllProductDetailsTable, ClusterDemandGraph, ClusterStatsSidebar, ClusterOrdersGraph },
  data() {
    return {
      // isLoading: false,
      // clusterOrders: []
    };
  },
  computed: {
    ...mapGetters("clusterViewer", {
      activeGraph: "activeGraph",
      ordersWithMatchesFiltered: "ordersWithMatchesFiltered",
    }),

    isLoading() {
      return !this.ordersWithMatchesFiltered.length;
    },

    active_graph: {
      get() {
        return this.activeGraph;
      },
      set(val) {
        this.setActiveGraph(val);
      },
    },
  },
  created() {
    // this.fetch();
  },
  methods: {
    ...mapActions("clusterViewer", {
      setActiveGraph: "setActiveGraph",
    }),

    // fetch() {
    //   let vm = this;
    //   vm.isLoading = true;
    //   axios.get(window.API_BASE + '/intelligence/clusters/' + this.clusterId + '/orders-with-matches').then(r => {
    //     vm.clusterOrders = r.data;
    //     vm.isLoading = false;
    //   }).catch(e => {
    //     console.log(e);
    //     vm.$message.error('Error loading cluster orders');
    //   });
    // }
  },
};
</script>

<style lang="scss">
.cluster-graphs {
  .sidebar-wrapper {
    border-left: 1px solid #eee;
    height: 100%;
    padding-left: 20px;
    padding-top: 24px;
  }

  .ant-col-19 {
    padding-top: 24px;
  }

  .ant-card-body {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
