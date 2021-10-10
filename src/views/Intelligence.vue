<template>
  <div class="intellegence">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Axiom Intelligence</h1>
      <div class="actions">
        <a-button icon="pie-chart" @click.prevent="viewAllClusters" type="primary">All Clusters
        </a-button>
      </div>
    </div>
    <!-- / Header -->

    <!-- Stats -->
    <div class="stats">
      <dashboard-stats></dashboard-stats>
    </div>
    <!-- / Stats -->

    <!-- Insights -->
    <div class="insights">
      <insights></insights>
    </div>
    <!-- / Insights -->
  </div>
</template>

<script>
import Insights from "./Intelligence/Insights.vue"
import DashboardStats from "./Intelligence/DashboardStats";

export default {
  components: {DashboardStats, Insights},
  methods: {
    viewAllClusters() {
      this.$router.push('/intelligence/clusters');
    }
  }
};
</script>

<style scoped>
.stats {
  padding-top: 30px;
}

.insights {
  padding-top: 20px;
}
</style>