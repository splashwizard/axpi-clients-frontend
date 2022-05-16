<template>
  <a-card>
    <a-card-grid :hoverable="false" style="width: 100%">
      <b class="spend-under-management-title">Matched Spend</b>
      {{ formatCost({ cost: overview["total_classified_spend"]["total"], cost_currency: "USD" }) }}
      <a-progress :percent="100" :success-percent="percentageAutomatic" :show-info="false" />
    </a-card-grid>
    <a-card-grid :hoverable="false" style="width: 50%; padding-top: 17px; padding-bottom: 17px">
      <b class="classified-title">AUTOMATIC</b>
      <a-statistic :value="automaticSpendFormatted" />
    </a-card-grid>
    <a-card-grid :hoverable="false" style="width: 50%; padding-top: 17px; padding-bottom: 17px">
      <b class="unclassified-title">MANUAL</b>
      <a-statistic :value="manualSpendFormatted" />
    </a-card-grid>
  </a-card>
</template>

<script>
import Orders from "../../../mixins/Orders";

export default {
  name: "TotalSpend",
  props: ["overview"],
  mixins: [Orders],
  computed: {
    percentageAutomatic() {
      let total = this.overview["total_classified_spend"]["total"];
      let automatic = this.overview["total_classified_spend"]["automatic"];

      return (automatic / total) * 100;
    },

    automaticSpendFormatted() {
      let automatic = this.overview["total_classified_spend"]["automatic"];
      return this.formatCost({
        cost: automatic,
        cost_currency: "USD",
      });
    },

    manualSpendFormatted() {
      let manual = this.overview["total_classified_spend"]["manual"];

      return this.formatCost({
        cost: manual,
        cost_currency: "USD",
      });
    },
  },
};
</script>

<style scoped>
.spend-under-management-title {
  font-weight: 500;
  margin-right: 5px;
  color: rgba(0, 0, 0, 0.85);
}

.classified-title {
  color: #52c41a;
  font-weight: 500;
}

.unclassified-title {
  color: #1890ff;
  font-weight: 500;
}
</style>
