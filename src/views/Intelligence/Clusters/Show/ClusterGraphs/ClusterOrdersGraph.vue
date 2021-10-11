<template>
  <div>
    <v-chart
        :key="graphReloadKey"
        :forceFit="true"
        renderer="svg"
        height="400"
        :data="graphData"
        :scale="scale"
    >
      <v-tooltip
          :showTitle="false"
          :crosshairs="tooltipCrosshairs"
          :itemTpl="tooltipItemTpl"
      />
      <v-axis
          dataKey="x"
          :title="{'text': xLabel}"
      >
      </v-axis>
      <v-axis
          dataKey="cost_per_unit"
          :title="{'text': 'Cost per unit'}"
      >
      </v-axis>
      <v-point
          position="x*cost_per_unit"
          :size="4"
          :opacity="0.65"
          :tooltip="pointTooltip"
          shape="circle"
      />
    </v-chart>
  </div>
</template>

<script>
const _ = require("lodash");
import Orders from "../../../../../mixins/Orders";

export default {
  props: ["orders", "graphReloadKey"],
  mixins: [Orders],
  computed: {
    xType() {
      return 'quantity';
    },

    xLabel() {
      if (this.xType === 'quantity') {
        return 'Quantity'
      }
      return 'x';
    },

    scale() {
      return [
        {
          dataKey: 'cost_per_unit',
          formatter: (val) => {
            return this.formatCost({cost: val, cost_currency: 'USD'})
          }
        }];
    },

    graphData() {
      let gd = [];

      _.each(this.orders, (order) => {
        let x = 0;

        if (order["products"] && order["products"].length) {
          if (order["products"][0]["normalisedQuantity"]) {
            order['product_quantity'] = order['products'][0]['normalisedQuantity']['normalisedUnitMagnitude'];
          }
        }

        let cost = order["Cost"];
        let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;

        // Get total quantity (product quantity x erp order quantity)
        let totalQuantity = orderQuantity;
        if (order['product_quantity']) {
          totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
        }

        // Get x value
        if (this.xType === 'quantity') {
          x = totalQuantity;
        }

        gd.push({
          description: order['PO Li Description'],
          quantity: totalQuantity,
          cost: cost,
          cost_per_unit: totalQuantity ? cost / totalQuantity : cost,
          x: x,
        });
      });

      return gd;
    },
  },

  data() {
    return {
      height: 500,
      pointTooltip: [
        "description*x*cost_per_unit",
        (description, x, cost_per_unit) => {
          return {
            name: description,
            // x: this.xLabel + ': ' +x,
            x_description: '<b>' + this.xLabel + ': ' + '</b>' + x,
            cost_per_unit: '<b>Cost per unit: </b>' + this.formatCost({cost: cost_per_unit, cost_currency: 'USD'}),
            value: this.xLabel + " (" + x + "), " + 'Cost per unit ' + "(" + this.formatCost({cost: cost_per_unit, cost_currency: 'USD'}) + ")",
          };
        },
      ],
      tooltipCrosshairs: {type: "cross"},
      tooltipItemTpl: `
        <li data-index={index} style="margin-bottom:4px;">
          <span style="background-color:{color};" class="g2-tooltip-marker"></span>
          <b>{name}</b><br />
          {x_description}<br />
          {cost_per_unit}
        </li>
      `,
    };
  },
};
</script>

<style>
</style>