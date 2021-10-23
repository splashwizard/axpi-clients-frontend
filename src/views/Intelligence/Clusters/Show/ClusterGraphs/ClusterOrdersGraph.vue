<template>
  <div :key="clusterViewerReloadKey">
    <!--    <div class="top-toolbar">-->
    <!--      <a-select v-model="xType" style="width: 200px;">-->
    <!--        <a-select-option v-for="(option, i) in xOptions" :value="option" :key="i">-->
    <!--          {{ formatGraphLabel(option) }}-->
    <!--        </a-select-option>-->
    <!--      </a-select>-->
    <!--    </div>-->
    <v-chart
        :key="graphReloadKey"
        :forceFit="true"
        renderer="svg"
        height="400"
        :data="graphData"
        :scale="scale"
    >
      <v-legend v-if="selectedColourByOption" data-key="Vendor"/>
      <v-tooltip
          :showTitle="false"
          :crosshairs="tooltipCrosshairs"
          :itemTpl="tooltipItemTpl"
      />
      <v-axis
          dataKey="x"
          :title="{'text': formatGraphLabel(xLabel) + (xUnit ? ' (' + xUnit + ')' : '')}"
      >
      </v-axis>
      <v-axis
          dataKey="cost_per_unit"
          :title="{'text': 'Cost per ' + costPerLabel}"
      >
      </v-axis>
      <v-point
          position="x*cost_per_unit"
          size="size"
          color="color"
          opacity="opacity"
          :tooltip="pointTooltip"
          shape="circle"
          :on-click="handlePointClicked"
      />
    </v-chart>
  </div>
</template>

<script>
const _ = require("lodash");
import Orders from "../../../../../mixins/Orders";
import {mapActions, mapGetters} from "vuex";

export default {
  props: ["orders", "graphReloadKey"],
  mixins: [Orders],
  computed: {
    ...mapGetters('clusterViewer', {
      selectedOrders: 'selectedOrders',
      selectedXOption: 'selectedXOption',
      selectedColourByOption: 'selectedColourByOption',
      selectedSizeByOption: 'selectedSizeByOption',
      clusterViewerReloadKey: 'clusterViewerReloadKey'
    }),

    xLabel() {
      if (this.xType === 'Quantity') {
        return 'Quantity'
      }
      return this.xType;
    },

    xUnit() {
      if (this.xLabel === 'volume') {
        return 'm<sup>3</sup>';
      }
      return '';
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
            return this.formatCostGraph({cost: val, cost_currency: 'USD'})
          }
        }];
    },

    graphData() {
      let gd = [];
      // let colours = ['#267278', '#65338d', '#4770b3'];
      // let colourMappings = {};
      // let numberOfColoursUsedSoFar = 0;

      _.each(this.orders, (order) => {
        let x = 0;

        let cost = order["Cost"];
        let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;

        // Get total quantity (product quantity x erp order quantity)
        let totalQuantity = order['total_quantity'];
        // if (order['product_quantity']) {
        //   totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
        // }

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
          // let firstProductNormalisedQuantity = order["products"][0]["normalisedQuantity"];
          // if (firstProductNormalisedQuantity) {
          //   let unit = firstProductNormalisedQuantity['normalisedUnitBase'];
          //   let magnitude = firstProductNormalisedQuantity['normalisedUnitMagnitude'];
          //   let entity = firstProductNormalisedQuantity['entity'];
          //   // let key = propertyType + ' - ' + unit;
          //   let key = entity;
          //   properties[key] = {
          //     magnitude: magnitude * orderQuantity,
          //     property_type: entity,
          //     unit: unit
          //   };
          // }
          if (order['product_numeric_properties']) {
            _.each(order['product_numeric_properties'], p => {
              let property = {
                magnitude: p.propertyValue * orderQuantity,
                property_type: p.propertyName,
                unit: p.propertyUnit
              };
              properties[p.propertyName] = property;
            });
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

        // let opacity = 0.65;
        let opacity = 0.7;
        let selectedOrderIds = _.map(this.selectedOrders, '_id');
        if (selectedOrderIds.includes(order['_id'])) {
          opacity = 0.9;
        }

        let color = 'blue';
        if (this.selectedColourByOption !== null) {
          let key = this.selectedColourByOption.key;
          color = order[key];
        }

        // Size by
        let size = null;
        if (this.selectedSizeByOption) {
          let sizeByProperty = _.find(order['product_numeric_properties'], p => {
            return p['propertyName'] === this.selectedSizeByOption;
          });
          if (sizeByProperty) {
            size = sizeByProperty['propertyValue'];
          } else {
            size = 0;
          }
        }

        gd.push({
          id: order['_id'],
          description: order['PO Li Description'],
          quantity: totalQuantity,
          cost: cost,
          cost_per_unit: x ? cost / x : cost,
          properties: properties,
          x: x,
          opacity: opacity,
          color: color,
          size: size
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
          if (x < 1) {
            x = Number.parseFloat(x).toExponential(3);
          }
          return {
            name: description,
            // x: this.xLabel + ': ' +x,
            x_description: '<b>' + this.formatGraphLabel(this.xLabel) + ': ' + '</b>' + x + ' ' + this.xUnit,
            cost_per_unit: '<b>Cost per ' + this.costPerLabel + ': </b>' + this.formatCostGraph({
              cost: cost_per_unit,
              cost_currency: 'USD'
            }),
            value: this.xLabel + " (" + x + "), " + 'Cost per unit ' + "(" + this.formatCostGraph({
              cost: cost_per_unit,
              cost_currency: 'USD'
            }) + ")",
          };
        },
      ];
    },

    xType: {
      get() {
        return this.selectedXOption;
      },
      set(val) {
        this.selectXOption(val);
      }
    }
  },

  data() {
    return {
      // xType: 'Quantity',
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

  created() {
    this.setXOptions(this.xOptions);
    this.selectXOption('Quantity');
    this.setColourByOptions([
      {key: 'Vendor', label: 'Vendor'}
    ]);
  },

  methods: {
    ...mapActions('clusterViewer', {
      toggleOrderSelected: 'toggleOrderSelected',
      setXOptions: 'setXOptions',
      selectXOption: 'selectXOption',
      setColourByOptions: 'setColourByOptions'
    }),

    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    },

    formatCostGraph(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : 'GBP';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(order.cost);
      }
      return order.cost;
    },

    handlePointClicked(point) {
      let orderId = point['data']['_origin']['id'];
      let order = _.find(this.orders, {'_id': orderId});
      // console.log(order);
      this.toggleOrderSelected(order);
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