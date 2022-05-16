<template>
  <div class="wrapper">
    <!-- No matches -->
    <a-alert type="error" message="No insights for this order" v-if="!insightsToShow.length" />
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
            <!--          {{ formatCost({cost: getSavingsForGroupAndSelectedOrder(insights), cost_currency: 'USD'}) }}-->
            {{ formatCost({ cost: getMinSavings(insights), cost_currency: "USD" }) }}
            <span v-if="getMaxSavings(insights) !== getMinSavings(insights)"
              >- {{ formatCost({ cost: getMaxSavings(insights), cost_currency: "USD" }) }}</span
            >
          </td>
          <td class="action">
            <a-button @click.prevent="$emit('set-insight-type', type)">View</a-button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- / Insights -->

    <div class="wrapper insights-list-wrapper"></div>
  </div>
</template>

<script>
let _ = require("lodash");
import Orders from "../../../../../mixins/Orders";
export default {
  name: "InsightsSummaryTable",
  props: ["insights", "selectedOrderId"],
  mixins: [Orders],
  computed: {
    insightsToShow() {
      if (this.selectedOrderId && this.insights.length) {
        return _.filter(this.insights, (insight) => {
          return String(insight.erp_order_id) === String(this.selectedOrderId);
        });
      }
      return this.insights.length ? this.insights : [];
    },

    insightsGroupedByType() {
      return _.groupBy(this.insights, "insight_type");
    },
  },
  methods: {
    formatType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },

    getSavingsForGroupAndSelectedOrder(insights) {
      return _.sum(
        _.map(
          _.filter(insights, (insight) => {
            return String(insight.erp_order_id) === String(this.selectedOrderId);
          }),
          "potential_savings"
        )
      );
    },

    getMinSavings(insights) {
      return _.min(
        _.map(
          _.filter(insights, (insight) => {
            return String(insight.erp_order_id) === String(this.selectedOrderId);
          }),
          "potential_savings"
        )
      );
    },

    getMaxSavings(insights) {
      return _.max(
        _.map(
          _.filter(insights, (insight) => {
            return String(insight.erp_order_id) === String(this.selectedOrderId);
          }),
          "potential_savings"
        )
      );
    },
  },
};
</script>

<style scoped lang="scss"></style>
