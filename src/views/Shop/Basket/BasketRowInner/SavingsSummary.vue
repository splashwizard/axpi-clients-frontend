<template>
  <a-table
    class="similar-products-row"
    slot="expandedRowRender"
    :columns="columns"
    :data-source="comparisons"
    :pagination="false"
  >
    <div slot="comparison" slot-scope="comparison, record">
      {{ comparison }}
      <a-progress
        type="circle"
        v-if="record.similarity"
        :width="37"
        style="margin-left: 10px"
        :percent="record.similarity"
      />
    </div>
    <div slot="cost" slot-scope="cost, record">
      {{
        record.cost
          ? formatCostInPence2dp({
              cost: record.cost,
              cost_currency: "USD",
            })
          : "-"
      }}
    </div>
    <div slot="savings" slot-scope="savings, record">
      <span>{{
        record.cost
          ? formatCostInPence2dp({
              cost: record.savings,
              cost_currency: "USD",
            })
          : "-"
      }}</span>
      <a-tag
        style="margin-left: 15px"
        v-if="row.itemType !== 'product' && record.comparison !== 'Similar Match'"
        :color="record.savings && record.savings > 0 ? 'green' : 'red'"
        >P&L
      </a-tag>
      <a-tag
        style="margin-left: 15px"
        v-if="row.itemType !== 'product' && record.comparison == 'Similar Match'"
        :color="record.savings && record.savings > 0 ? 'green' : 'red'"
        >Cost Avoidance
      </a-tag>
      <a-tag
        style="margin-left: 15px"
        v-if="row.itemType == 'product'"
        :color="record.savings && record.savings > 0 ? 'green' : 'red'"
      >
        Cost Avoidance
      </a-tag>
    </div>
  </a-table>
</template>

<script>
import Dates from "../../../../mixins/Dates";
import Orders from "../../../../mixins/Orders";

const _ = require("lodash");

const columns = [
  {
    title: "Comparison",
    dataIndex: "comparison",
    scopedSlots: { customRender: "comparison" },
  },
  {
    title: "Cost",
    dataIndex: "cost",
    key: "cost",
    scopedSlots: { customRender: "cost" },
  },
  {
    title: "Savings",
    dataIndex: "savings",
    key: "savings",
    scopedSlots: { customRender: "savings" },
  },
];
export default {
  name: "SavingsSummary",
  props: ["row"],
  mixins: [Dates, Orders],
  data() {
    return {
      columns,
    };
  },
  computed: {
    benchmarkPrice() {
      if (this.row.itemType == "product" && this.row.suggestedProducts.length) {
        let costs = _.map(this.row.suggestedProducts, "cost");
        return _.min(costs) * this.row.quantity;
      }

      if (this.row.order && this.row.order.id == 3) {
        return 16183.59 * 100;
      }

      let prices = _.map(this.row.prices, "price");
      let average = _.mean(prices) * 1.3;
      return average;
    },

    comparisons() {
      let comparisons = [];

      if (this.row.itemType == "product") {
        comparisons.push({
          comparison: this.row.suggestedProducts.length ? "Similar Match" : "Benchmark",
          similarity: 93,
          cost: this.benchmarkPrice,
          savings: this.row.selectedPrice ? this.benchmarkPrice - this.row.selectedPrice.price * this.row.quantity : 0,
        });
      }

      if (this.row.itemType !== "product") {
        comparisons.push({
          comparison: "Historic TruePrice",
          cost: this.benchmarkPrice,
          savings: this.row.selectedPrice ? this.benchmarkPrice - this.row.selectedPrice.price : 0,
        });
      }

      if (this.row.order) {
        comparisons.push({
          comparison: "Exact Match",
          cost: this.row.order.cost,
          // savings: (this.benchmarkPrice - this.row.order.cost)
          savings: this.row.selectedPrice ? this.row.order.cost - this.row.selectedPrice.price : 0,
        });
        comparisons.push({
          comparison: "Similar Match",
          cost: 15622 * 100,
          savings: this.row.selectedPrice ? 15622 * 100 - this.row.selectedPrice.price : 0,
          similarity: 87,
        });
      }

      return comparisons;
    },
  },
};
</script>

<style lang="scss">
.similar-products-row {
  th {
    padding-top: 5px !important;
  }

  .text-danger {
    color: #f5222d;
  }

  .text-success {
    color: #52c41a;
  }
}
</style>
