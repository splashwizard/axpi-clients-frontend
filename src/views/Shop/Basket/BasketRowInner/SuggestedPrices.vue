<template>
  <a-table class="suggested-prices-row"
           slot="expandedRowRender"
           :columns="columns"
           :data-source="pricesWithSavings"
           :pagination="false"
  >
    <div slot="cost" slot-scope="cost, record">
      {{
        record.price ? formatCostInPence2dp({
          cost: record.price,
          cost_currency: 'USD'
        }) : '-'
      }}
    </div>
    <div slot="savings" slot-scope="savings">
      {{
        savings ? formatCostInPence2dp({
          cost: savings,
          cost_currency: 'USD'
        }) : '-'
      }}
    </div>
    <div slot="co2e" slot-scope="co2e">
                  <span v-if="getSupplierCo2e(co2e, row)">
                    {{ getSupplierCo2e(co2e, row) }} kg
                  </span>
      <a-tag color="red" v-else>Unknown</a-tag>
    </div>
  </a-table>
</template>

<script>
import Orders from "../../../../mixins/Orders";

const _ = require('lodash');

const columns = [
  {title: 'Supplier', dataIndex: 'supplier_name', key: 'supplier_name'},
  {title: 'Cost', dataIndex: 'cost', key: 'cost', scopedSlots: {customRender: 'cost'}},
  {title: 'Savings', dataIndex: 'savings', key: 'savings', scopedSlots: {customRender: 'savings'}},
  {title: 'CO2e', dataIndex: 'co2e', key: 'co2e', scopedSlots: {customRender: 'co2e'}},
];

export default {
  name: "SuggestedPrices",
  mixins: [Orders],
  props: ['row'],
  data() {
    return {
      columns
    }
  },
  computed: {
    benchmarkPrice() {
      let prices = _.map(this.row.prices, 'price');
      let average = _.mean(prices) * 1.3;
      return average;
    },

    pricesWithSavings() {
      return _.map(this.row.prices, r => {
        return {
          savings: (this.benchmarkPrice - r.price),
          ...r
        }
      });
    }
  },
  methods: {
    getSupplierCo2e(co2e, item) {
      let co2eToReturn = co2e;
      if (item.itemType === 'product') {
        co2eToReturn = co2eToReturn * item.quantity;
      }
      return co2eToReturn ? Math.round(co2eToReturn * 100) / 100 : 0;
    }
  }
}
</script>

<style lang="scss">
.suggested-prices-row {
  th {
    padding-top: 5px !important;
  }
}
</style>