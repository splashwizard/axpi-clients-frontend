<template>
  <a-card>
    <a-card-grid :hoverable="false" style="width: 100%">
      <b class="spend-under-management-title">Spend Under Management</b>
      {{ formatCost({ cost: overview["total_spend"]["total"], cost_currency: "USD" }) }}
      <a-progress :percent="100" :success-percent="percentageClassified" :show-info="false" />
    </a-card-grid>
    <a-card-grid :hoverable="false" style="width: 50%; padding-top: 17px; padding-bottom: 17px">
      <b class="classified-title">CLASSIFIED</b>
      <a-statistic :value="classifiedSpendFormatted" />
    </a-card-grid>
    <a-card-grid :hoverable="false" style="width: 50%; padding-top: 17px; padding-bottom: 17px">
      <b class="unclassified-title">UNCLASSIFIED</b>
      <a-statistic :value="unclassifiedSpendFormatted" />
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
    percentageClassified() {
      let total = this.overview["total_spend"]["total"];
      let classified = this.overview["total_spend"]["classified"];

      return (classified / total) * 100;
    },

    classifiedSpendFormatted() {
      let classified = this.overview["total_spend"]["classified"];
      return this.formatCost({
        cost: classified,
        cost_currency: "USD",
      });
    },

    unclassifiedSpendFormatted() {
      let unclassified = this.overview["total_spend"]["unclassified"];

      return this.formatCost({
        cost: unclassified,
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
