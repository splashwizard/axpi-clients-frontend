<template>
  <div>
    <a-page-header :title="pageTitle" @back="backToIntelligence">
      <template slot="extra">
        <create-cluster-button-and-modal></create-cluster-button-and-modal>
      </template>
    </a-page-header>

    <loading-screen :is-loading="isDeleting"></loading-screen>

    <clusters-table
      :insight-type-filter="insightTypeFilter"
      @delete-cluster="deleteCluster"
      :reload-key="reloadKey"
    ></clusters-table>
  </div>
</template>

<script>
import ClustersTable from "./Index/ClustersTable";
import CreateClusterButtonAndModal from "./CreateClusterButtonAndModal";
import axios from "axios";

export default {
  name: "Index",
  components: { CreateClusterButtonAndModal, ClustersTable },
  data() {
    return {
      isDeleting: false,
      reloadKey: 1,
    };
  },
  computed: {
    insightTypeFilter() {
      if (this.$route.query.insight_type) {
        return this.$route.query.insight_type;
      }
      return null;
    },

    pageTitle() {
      switch (this.insightTypeFilter) {
        case "pricing":
          return "Clusters With Pricing Outlier Insights";
        case "demand-aggregation":
          return "Clusters With Demand Aggregation Insights";
        case "alternative-product":
          return "Clusters With Alternative Product Insights";
        case "contract-negotiation":
          return "Clusters With Contract Negotiation Insights";
        case "stockpiling-advised":
          return "Clusters With Stockpiling Advised Insights";
        case "expected-demand-increases":
          return "Clusters With Expected Demand Increases Insights";
        case "unmatched-orders":
          return "Clusters With Unmatched Orders Insights";
        default:
          return "All Clusters";
      }
    },
  },
  watch: {
    $route() {
      this.incrementReloadClustersKey();
    },
  },
  methods: {
    backToIntelligence() {
      this.$router.push("/intelligence");
    },

    incrementReloadClustersKey() {
      this.reloadKey += 1;
    },

    deleteCluster(cluster) {
      let vm = this;
      vm.isDeleting = true;
      axios
        .delete(window.API_BASE + "/intelligence/clusters/" + cluster["_id"])
        .then(() => {
          vm.isDeleting = false;
          vm.$message.success("Cluster deleted successfully");
          vm.incrementReloadClustersKey();
        })
        .catch((e) => {
          console.log(e);
          vm.isDeleting = false;
          vm.$message.success("Error deleting order");
        });
    },
  },
};
</script>

<style scoped></style>
