<template>
  <div class="cluster-show">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-layout>
      <a-layout style="padding: 7px 30px">
        <div class="wrapper">
          <a-page-header
            v-if="cluster"
            :title="cluster.name"
            @back="backToAllClusters"
          >
            <template slot="extra">
              <a-button
                type="primary"
                icon="plus"
                @click.prevent="toggleSidebar"
                >Add Order</a-button
              >
            </template>
          </a-page-header>

          <div v-if="cluster">
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
            <a-tabs>
              <a-tab-pane tab="All Orders">
                <cluster-orders-table
                  :key="reloadKey"
                  :cluster-id="cluster['_id']"
                ></cluster-orders-table>
              </a-tab-pane>
            </a-tabs>
            <!-- / Orders & Insights -->
          </div>
        </div>
      </a-layout>
      <a-layout-sider
        width="400"
        theme="dark"
        :style="{ background: '#f7fafc', borderLeft: '1px solid #e3e8ee' }"
        :collapsed-width="0"
        v-model="shouldHideSidebar"
        :trigger="null"
        collapsible
      >
        <sidebar
          v-if="shouldShowSidebar"
          @close="toggleSidebar"
          @reload="incrementReloadKey"
          :cluster-id="cluster['_id']"
        ></sidebar>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
import axios from "axios";
import ClusterOrdersTable from "./Show/ClusterOrdersTable";
import ClusterGraphs from "./Show/ClusterGraphs.vue";
import Sidebar from "./Show/Sidebar.vue";

const _ = require("lodash");

export default {
  name: "Show",
  components: {
    ClusterOrdersTable,
    ClusterGraphs,
    Sidebar
  },
  created() {
    this.loadCluster(this.$route.params.id);
  },
  data() {
    return {
      cluster: null,
      reloadKey: 1,
      graphReloadKey: 1,
      shouldShowSidebar: false,
    };
  },
  computed: {
    shouldHideSidebar() {
      return !this.shouldShowSidebar;
    },
  },
  watch: {
    $route() {
      this.loadCluster(this.$route.params.id);
    },
  },
  methods: {
    backToAllClusters() {
      this.$router.push("/intelligence/clusters");
    },

    toggleSidebar() {
      this.shouldShowSidebar = !this.shouldShowSidebar;
      let vm = this;
      window.setTimeout(() => {
        vm.graphReloadKey += 1;
      }, 210)
    },

    loadCluster(id) {
      let vm = this;
      vm.cluster = null;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/intelligence/clusters/" + id)
        .then((r) => {
          vm.isLoading = false;
          vm.cluster = r.data;
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading cluster");
          console.log(e);

          let errors;
          if (
            e.response &&
            e.response.data &&
            typeof e.response.data === "object"
          ) {
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