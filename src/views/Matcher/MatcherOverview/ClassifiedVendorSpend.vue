<template>
  <div>
    <v-chart :forceFit="true" renderer="svg" :height="height" :scale="scale" :data="graphData">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-stack-bar position="vendor*spend" color="type" />
    </v-chart>
  </div>
</template>

<script>
import Orders from "../../../mixins/Orders";
const _ = require("lodash");

export default {
  name: "ClassifiedVendorSpend",
  props: ["overview"],
  mixins: [Orders],
  data() {
    return {
      height: 400,
    };
  },
  methods: {
    formatCostTruncated(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : "GBP";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(order.cost);
      }
      return order.cost;
    },
  },
  computed: {
    graphData() {
      let spendByVendor = this.overview["vendor_spend"]["spend"];

      let gd = [];
      _.each(spendByVendor, (vendorSpend) => {
        gd.push({
          vendor: vendorSpend["vendor"],
          type: "Unclassified",
          spend: vendorSpend["unmatched"],
        });
        gd.push({
          vendor: vendorSpend["vendor"],
          type: "Classified",
          spend: vendorSpend["matched"],
        });
      });

      return gd;
    },

    scale() {
      return [
        {
          dataKey: "vendor",
          type: "cat",
        },
        {
          dataKey: "spend",
          formatter: (val) => {
            if (val > 1000000000) {
              return this.formatCostTruncated({ cost: val / 1000000000, cost_currency: "USD" }) + "B";
            }
            if (val > 1000000) {
              return this.formatCostTruncated({ cost: val / 1000000, cost_currency: "USD" }) + "M";
            }
            return this.formatCost({ cost: val, cost_currency: "USD" });
          },
        },
      ];
    },
  },
};
</script>

<style scoped></style>
