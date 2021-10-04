<template>
  <div>
    <a-page-header title="All Clusters" @back="backToIntelligence">
      <template slot="extra">
        <create-cluster-button-and-modal></create-cluster-button-and-modal>
      </template>
    </a-page-header>

    <loading-screen :is-loading="isDeleting"></loading-screen>

    <clusters-table
      @delete-cluster="deleteCluster"
      :reload-key="reloadKey"
    ></clusters-table>
  </div>
</template>

<script>
import ClustersTable from "./Index/ClustersTable";
import CreateClusterButtonAndModal from "./CreateClusterButtonAndModal";
import axios from 'axios';
export default {
  name: "Index",
  components: { CreateClusterButtonAndModal, ClustersTable },
  data() {
    return {
      isDeleting: false,
      reloadKey: 1,
    };
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

<style scoped>
</style>