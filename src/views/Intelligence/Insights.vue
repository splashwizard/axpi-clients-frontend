<template>
  <div>
    <a-tabs v-model="activeTab">
      <a-tab-pane key="all-insights" tab="All Insights"> </a-tab-pane>
      <a-tab-pane key="price-insights" tab="Price Insights"> </a-tab-pane>
      <a-tab-pane key="demand-insights" tab="Demand Insights"> </a-tab-pane>
      <a-tab-pane key="contract-insights" tab="Contract Insights"> </a-tab-pane>
    </a-tabs>

    <!-- Insights -->
    <div class="insights" v-if="activeTab === 'all-insights'">
        Testing 123
    </div>
    <!-- / Insights -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "all-insights",
    };
  },
  computed: {
      insightsToShow() {
          return [
              {
                  amount: 123,
                  description: 'Pricing Outliers'
              }
          ]
      }
  }
};
</script>

<style>
</style>