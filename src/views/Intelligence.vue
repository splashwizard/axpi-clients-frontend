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
      <a-row :gutter="20">
        <!-- Overview -->
        <a-col :span="8">
          <a-descriptions size="middle" bordered title="Overview" :column="1">
            <a-descriptions-item label="Suppliers">189</a-descriptions-item>
            <a-descriptions-item label="Business Units">23</a-descriptions-item>
            <a-descriptions-item label="Categories">5</a-descriptions-item>
          </a-descriptions>
        </a-col>
        <!-- / Overview -->
        <!-- Spend -->
        <a-col :span="8">
          <a-descriptions size="middle" bordered title="Spend" :column="1">
            <a-descriptions-item label="Last 12 Months"
            >$100M
            </a-descriptions-item
            >
            <a-descriptions-item label="Spend Managed">95%</a-descriptions-item>
            <a-descriptions-item label="Spend Managed"
            >$300M
            </a-descriptions-item
            >
          </a-descriptions>
        </a-col>
        <!-- / Spend -->
        <!-- Demand -->
        <a-col :span="8">
          <a-descriptions size="middle" bordered title="Spend" :column="1">
            <a-descriptions-item label="Last 12 Months"
            >$100M
            </a-descriptions-item
            >
            <a-descriptions-item label="Spend Managed">95%</a-descriptions-item>
            <a-descriptions-item label="Spend Managed"
            >$300M
            </a-descriptions-item
            >
          </a-descriptions>
        </a-col>
        <!-- / Demand -->
      </a-row>
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

export default {
  components: {Insights},
  methods: {
    viewAllClusters() {
      this.$router.push('/intelligence/clusters');
    }
  }
};
</script>

<style scoped>
.stats {
  padding-top: 20px;
}

.insights {
  padding-top: 20px;
}
</style>