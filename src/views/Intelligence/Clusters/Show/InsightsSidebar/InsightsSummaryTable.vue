<template>
  <div class="wrapper">
    <!-- No matches -->
    <a-alert type="error"
             message="No insights for this order"
             v-if="!insightsToShow.length"/>
    <!-- / No matches -->

    <!-- Insights -->
    <table v-if="insightsToShow.length" class="axpi-basic-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Potential Savings</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(insights, type) in insightsGroupedByType" :key="type">
        <td>
          {{ formatType(type) }}
        </td>
        <td>
          tbd
        </td>
        <td class="action">
          <a-button @click.prevent="$emit('set-insight-type', type)" type="primary">View</a-button>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- / Insights -->

    <div class="wrapper insights-list-wrapper">

    </div>
  </div>
</template>

<script>
let _ = require('lodash');
export default {
  name: "InsightsSummaryTable",
  props: ['insights', 'selectedOrderId'],
  computed: {
    insightsToShow() {
      if (this.selectedOrderId && this.insights.length) {
        return _.filter(this.insights, insight => {
          return String(insight.erp_order_id) === String(this.selectedOrderId);
        });
      }
      return this.insights.length ? this.insights : [];
    },

    insightsGroupedByType() {
      return _.groupBy(this.insights, 'insight_type');
    }
  },
  methods: {
    formatType(type) {
     return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
}
</script>

<style scoped lang="scss">
</style>