<template>
  <div class="cluster-show">
    <loading-screen
      :is-loading="isLoading || isLoadingInsights || isLoadingOrdersWithMatches || isDeleting"
    ></loading-screen>

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header v-if="cluster" :title="cluster.name" @back="backToAllClusters">
            <template slot="extra">
              <a-button icon="download" @click.prevent="exportCsv"></a-button>

              <cluster-filters></cluster-filters>

              <a-button type="primary" icon="plus" @click.prevent="() => toggleSidebar()">Add Order </a-button>
            </template>
          </a-page-header>

          <div v-if="cluster && !isLoadingOrdersWithMatches">
            <!-- Graphs -->
            <div class="cluster-graphs-wrapper">
              <cluster-graphs
                :key="reloadKey"
                :graph-reload-key="graphReloadKey"
                :cluster-id="cluster['_id']"
              ></cluster-graphs>
            </div>
            <!-- / Graphs -->

            <!-- Orders & Insights -->
            <a-tabs v-if="activeGraph !== 'product-details'">
              <a-tab-pane tab="All Orders">
                <cluster-orders-table
                  :key="reloadKey"
                  :cluster-id="cluster['_id']"
                  @record-selected="(record) => viewInsightsFor(record)"
                  @remove-order="removeOrder"
                ></cluster-orders-table>
              </a-tab-pane>
            </a-tabs>
            <!-- / Orders & Insights -->
          </div>
        </div>
      </a-layout>
      <a-layout-sider
        :width="sidebarType === 'add-order' ? 500 : 500"
        theme="dark"
        :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
        :collapsed-width="0"
        v-model="shouldHideSidebar"
        :trigger="null"
        collapsible
      >
        <sidebar
          v-if="shouldShowSidebar && sidebarType === 'add-order'"
          @close="() => toggleSidebar()"
          @reload="incrementReloadKey"
          :cluster-id="cluster['_id']"
        ></sidebar>

        <insights-sidebar
          v-if="shouldShowSidebar && sidebarType === 'insights'"
          @close="() => toggleSidebar('insights')"
          @reload="incrementReloadKey"
          @insights-saved="incrementReloadKey"
          :cluster-id="cluster['_id']"
          :insights-applied="insightsApplied"
          :erp-order-id="selectedErpOrderId"
          :insights="insights"
        ></insights-sidebar>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import axios from "axios";
import ClusterOrdersTable from "./Show/ClusterOrdersTable";
import ClusterGraphs from "./Show/ClusterGraphs.vue";
import Sidebar from "./Show/Sidebar.vue";
import InsightsSidebar from "./Show/InsightsSidebar";
import { mapActions, mapGetters } from "vuex";
import ClusterFilters from "./Show/ClusterFilters";
import { ExportToCsv } from "export-to-csv";
import moment from "moment";

const _ = require("lodash");

export default {
  name: "Show",
  components: {
    ClusterFilters,
    InsightsSidebar,
    ClusterOrdersTable,
    ClusterGraphs,
    Sidebar,
  },
  created() {
    this.loadCluster(this.$route.params.id);
  },
  data() {
    return {
      reloadKey: 1,
      graphReloadKey: 1,
      shouldShowSidebar: false,
      sidebarType: "add-order",
      selectedErpOrderId: null,
      isDeleting: false,

      isLoading: false,
      isLoadingInsights: false,
      isLoadingOrdersWithMatches: false,
    };
  },
  computed: {
    ...mapGetters("clusterViewer", {
      cluster: "cluster",
      activeGraph: "activeGraph",
      ordersWithMatchesFiltered: "ordersWithMatchesFiltered",
    }),

    shouldHideSidebar() {
      return !this.shouldShowSidebar;
    },

    insightsApplied() {
      if (this.cluster["insights_applied"]) {
        return this.cluster["insights_applied"];
      }
      return [];
    },

    exportData() {
      return _.map(this.ordersWithMatchesFiltered, (o) => {
        let params = {
          Name: o["PO Li Description"],
        };

        // Date Purchased
        let datePurchased = o["PO Initial Create Date"];
        if (datePurchased && datePurchased["$date"] && datePurchased["$date"]["$numberLong"]) {
          let timestamp = datePurchased["$date"]["$numberLong"] / 1000;
          params["Date Purchased"] = moment.unix(timestamp).format("DD/MM/YYYY");
        } else {
          params["Date Purchased"] = "-";
        }

        // Quantity
        params["Quantity"] = o["total_quantity"] ? o["total_quantity"] : Number(o["Quantity"]);

        return params;
      });
    },
  },
  watch: {
    $route() {
      this.loadCluster(this.$route.params.id);
    },
  },
  methods: {
    ...mapActions("clusterViewer", {
      setCluster: "setCluster",
      setSelectedOrders: "setSelectedOrders",
      setInsights: "setInsights",
      setOrdersWithMatches: "setOrdersWithMatches",
      setActiveGraph: "setActiveGraph",
    }),

    exportCsv() {
      const options = {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: true,
        title: this.cluster.name,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
        filename: this.cluster.name,
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(this.exportData);
    },

    backToAllClusters() {
      this.$router.push("/intelligence/clusters");
    },

    toggleSidebar(sidebarType = "add-order") {
      let vm = this;

      if (sidebarType !== this.sidebarType) {
        console.log(sidebarType);
        console.log(this.sidebarType);
        this.sidebarType = sidebarType;
        if (!this.shouldShowSidebar) {
          this.shouldShowSidebar = true;
        }
        window.setTimeout(() => {
          vm.graphReloadKey += 1;
        }, 250);
        return false;
      }

      this.shouldShowSidebar = !this.shouldShowSidebar;
      window.setTimeout(() => {
        vm.graphReloadKey += 1;
      }, 250);
    },

    viewInsightsFor(record) {
      let vm = this;

      this.sidebarType = "insights";
      this.selectedErpOrderId = record["_id"];

      if (!this.shouldShowSidebar) {
        this.shouldShowSidebar = true;
      }

      window.setTimeout(() => {
        vm.graphReloadKey += 1;
      }, 250);
    },

    loadCluster(id) {
      let vm = this;
      this.setCluster(null);
      this.setOrdersWithMatches([]);
      this.setInsights([]);
      this.setActiveGraph("orders");
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/intelligence/clusters/" + id)
        .then((r) => {
          vm.isLoading = false;
          vm.setCluster(r.data);
          vm.loadInsights();
          vm.loadOrdersWithMatches();
          vm.setSelectedOrders([]);
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading cluster");
          console.log(e);

          let errors;
          if (e.response && e.response.data && typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },

    loadOrdersWithMatches() {
      let vm = this;
      // vm.insights = [];
      vm.setOrdersWithMatches([]);
      vm.isLoadingOrdersWithMatches = true;
      axios
        .get(window.API_BASE + "/intelligence/clusters/" + vm.cluster["_id"] + "/orders-with-matches")
        .then((r) => {
          vm.isLoadingOrdersWithMatches = false;
          vm.setOrdersWithMatches(r.data);
          // vm.insights = r.data;
        })
        .catch((e) => {
          vm.isLoadingOrdersWithMatches = false;
          vm.$message.error("Error loading orders with matches");
          console.log(e);

          let errors;
          if (e.response && e.response.data && typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },

    loadInsights() {
      let vm = this;
      // vm.insights = [];
      vm.setInsights([]);
      vm.isLoadingInsights = true;
      axios
        .get(window.API_BASE + "/intelligence/clusters/" + vm.cluster["_id"] + "/insights")
        .then((r) => {
          vm.isLoadingInsights = false;
          vm.setInsights(r.data);
          // vm.insights = r.data;
        })
        .catch((e) => {
          vm.isLoadingInsights = false;
          vm.$message.error("Error loading insights");
          console.log(e);

          let errors;
          if (e.response && e.response.data && typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },

    incrementReloadKey() {
      this.reloadKey += 1;
    },

    removeOrder(order) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .post(window.API_BASE + "/intelligence/clusters/" + this.cluster["_id"] + "/remove-order", {
          erp_order_id: order["_id"],
        })
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("Order removed successfully");
          vm.loadCluster(this.cluster["_id"]);
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.error("Error removing order");
        });
    },
  },
};
</script>

<style scoped>
.cluster-show {
  height: 100%;
}

.wrapper {
  max-height: 100%;
  overflow-y: scroll;
}

.cluster-graphs-wrapper {
  margin-bottom: 20px;
}
</style>
