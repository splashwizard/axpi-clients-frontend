<template>
  <div>
    <div class="top-toolbar">
      <a-select v-model="xType" style="width: 200px;">
        <a-select-option v-for="(option, i) in xOptions" :value="option" :key="i">
          {{ formatGraphLabel(option) }}
        </a-select-option>
      </a-select>
    </div>
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
          :title="{'text': formatGraphLabel(xLabel)}"
      >
      </v-axis>
      <v-axis
          dataKey="cost_per_unit"
          :title="{'text': 'Cost per ' + costPerLabel}"
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
    xLabel() {
      if (this.xType === 'Quantity') {
        return 'Quantity'
      }
      return this.xType;
    },

    costPerLabel() {
      if (this.xType === 'Quantity') {
        return 'unit';
      }
      return this.xLabel;
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

        // Properties
        let properties = {};
        if (order["products"] && order["products"].length) {
          // let firstProductNormalisedData = order["products"][0]["normalisedData"];
          // if (firstProductNormalisedData) {
          //   _.each(firstProductNormalisedData, (propertyData, propertyType) => {
          //     let unit = propertyData['unifiedData'][0]['unit'];
          //     let magnitude = propertyData['unifiedData'][0]['rawMagnitude'];
          //     // let key = propertyType + ' - ' + unit;
          //     let key = unit;
          //     properties[key] = {
          //       magnitude: magnitude,
          //       property_type: propertyType,
          //       unit: unit
          //     };
          //   });
          // }
          let firstProductNormalisedQuantity = order["products"][0]["normalisedQuantity"];
          if (firstProductNormalisedQuantity) {
            let totalMeasure = firstProductNormalisedQuantity['totalMeasure'];
            if (totalMeasure) {
              let unit = totalMeasure['normalisedUnitBase'];
              let magnitude = totalMeasure['normalisedUnitMagnitude'];
              let entity = totalMeasure['entity'];
              // let key = propertyType + ' - ' + unit;
              let key = entity;
              properties[key] = {
                magnitude: magnitude * orderQuantity,
                property_type: entity,
                unit: unit
              };
            }
          }
        }
        order["properties"] = properties;

        // Get x value
        if (this.xType === 'Quantity') {
          x = totalQuantity;
        } else {
          if (Object.keys(properties).includes(this.xType)) {
            x = properties[this.xType]['magnitude'];
          } else {
            x = null;
          }
        }

        gd.push({
          description: order['PO Li Description'],
          quantity: totalQuantity,
          cost: cost,
          cost_per_unit: x ? cost / x : cost,
          properties: properties,
          x: x,
        });
      });

      return gd;
    },

    xOptions() {
      let options = ['Quantity'];
      _.each(this.graphData, gd => {
        let propertyLabels = Object.keys(gd['properties']);
        options.push(propertyLabels);
        options = _.flatten(options);
      });
      return _.uniq(options);
    },

    pointTooltip() {
      return [
        "description*x*cost_per_unit",
        (description, x, cost_per_unit) => {
          return {
            name: description,
            // x: this.xLabel + ': ' +x,
            x_description: '<b>' + this.xLabel + ': ' + '</b>' + x,
            cost_per_unit: '<b>Cost per ' + this.costPerLabel + ': </b>' + this.formatCost({
              cost: cost_per_unit,
              cost_currency: 'USD'
            }),
            value: this.xLabel + " (" + x + "), " + 'Cost per unit ' + "(" + this.formatCost({
              cost: cost_per_unit,
              cost_currency: 'USD'
            }) + ")",
          };
        },
      ];
    }
  },

  data() {
    return {
      xType: 'Quantity',
      height: 500,
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

  methods: {
    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    }
  }
};
</script>

<style scoped>
.top-toolbar {
  margin-bottom: 30px;
  /*float: right;*/
}
</style>