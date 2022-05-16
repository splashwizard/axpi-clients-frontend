<template>
  <div class="intellegence">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Axiom Insights</h1>
      <div class="actions">
        <intelligence-filters
          @filter-updated="handleFilterUpdated"
          @set-filters="setFilters"
          :filters="filters"
        ></intelligence-filters>

        <a-button icon="pie-chart" @click.prevent="viewAllClusters" type="primary">All Clusters </a-button>
      </div>
    </div>
    <!-- / Header -->

    <!-- Stats -->
    <div class="stats">
      <dashboard-stats :filters="filters" :key="reloadKey"></dashboard-stats>
    </div>
    <!-- / Stats -->

    <!-- Insights -->
    <div class="insights">
      <insights :filters="filters" :key="reloadKey"></insights>
    </div>
    <!-- / Insights -->
  </div>
</template>

<script>
import Insights from "./Intelligence/Insights.vue";
import DashboardStats from "./Intelligence/DashboardStats";
import IntelligenceFilters from "./Intelligence/IntelligenceFilters";

export default {
  components: { IntelligenceFilters, DashboardStats, Insights },
  methods: {
    viewAllClusters() {
      this.$router.push("/intelligence/clusters");
    },

    incrementReloadKey() {
      this.reloadKey += 1;
    },

    setFilters(filters) {
      this.filters = filters;
    },

    handleFilterUpdated() {
      this.incrementReloadKey();
    },
  },
  data() {
    return {
      reloadKey: 1,
      filters: {
        filters_enabled: {},
        date_range: "last-12-months",
      },
    };
  },
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
