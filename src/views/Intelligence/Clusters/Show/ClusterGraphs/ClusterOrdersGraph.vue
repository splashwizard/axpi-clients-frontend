<template>
  <div :key="clusterViewerReloadKey">
    <!--    <div class="top-toolbar">-->
    <!--      <a-select v-model="xType" style="width: 200px;">-->
    <!--        <a-select-option v-for="(option, i) in xOptions" :value="option" :key="i">-->
    <!--          {{ formatGraphLabel(option) }}-->
    <!--        </a-select-option>-->
    <!--      </a-select>-->
    <!--    </div>-->
    <v-chart :key="graphReloadKey" :forceFit="true" renderer="svg" height="400" :data="graphDataToShow" :scale="scale">
      <v-legend v-if="selectedColourByOption" data-key="Vendor" />
      <v-tooltip :showTitle="false" :crosshairs="tooltipCrosshairs" :itemTpl="tooltipItemTpl" />
      <v-axis dataKey="x" :title="{ text: formatGraphLabel(xLabel) + (xUnit ? ' (' + xUnit + ')' : '') }"> </v-axis>
      <v-axis dataKey="cost_per_unit" :title="{ text: 'Cost per ' + costPerLabel }"> </v-axis>
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
import { mapActions, mapGetters } from "vuex";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

export default {
  props: ["orders", "graphReloadKey"],
  mixins: [Orders],
  computed: {
    ...mapGetters("clusterViewer", {
      selectedOrders: "selectedOrders",
      selectedXOption: "selectedXOption",
      selectedColourByOption: "selectedColourByOption",
      selectedSizeByOption: "selectedSizeByOption",
      clusterViewerReloadKey: "clusterViewerReloadKey",
      startDate: "startDate",
      endDate: "endDate",
    }),

    start_date: {
      get() {
        return this.startDate;
      },
      set(val) {
        this.setStartDate(val);
      },
    },

    end_date: {
      get() {
        return this.endDate;
      },
      set(val) {
        this.setEndDate(val);
      },
    },

    datesFromGraphData() {
      return _.map(this.graphData, "order_date_moment");
    },

    earliestDate() {
      return moment.min(this.datesFromGraphData);
    },

    latestDate() {
      return moment.max(this.datesFromGraphData);
    },

    graphDateRange() {
      let start_date = this.start_date;
      let end_date = this.end_date;

      if (!start_date) {
        start_date = this.earliestDate;
      }
      if (!end_date) {
        end_date = this.latestDate;
      }

      return moment.range(start_date, end_date);
    },

    xLabel() {
      if (this.xType === "Quantity") {
        return "Quantity";
      }
      return this.xType;
    },

    xUnit() {
      if (this.xLabel === "volume") {
        return "cubic metres";
      }
      return "";
    },

    costPerLabel() {
      if (this.xType === "Quantity") {
        return "unit";
      } else if (this.xType === "volume") {
        return "cubic metre";
      }
      return this.xLabel;
    },

    scale() {
      return [
        {
          dataKey: "cost_per_unit",
          formatter: (val) => {
            return this.formatCostGraph({ cost: val, cost_currency: "USD" });
          },
        },
      ];
    },

    graphDataToShow() {
      return _.filter(this.graphData, (d) => {
        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.start_date) {
          if (d.order_date_moment.isBefore(this.start_date)) {
            return false;
          }
        }
        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.end_date) {
          if (d.order_date_moment.isAfter(this.end_date)) {
            return false;
          }
        }
        return true;
      });
    },

    graphData() {
      let gd = [];
      // let colours = ['#267278', '#65338d', '#4770b3'];
      // let colourMappings = {};
      // let numberOfColoursUsedSoFar = 0;

      _.each(this.orders, (order) => {
        let x = 0;

        // let cost = order["Cost"];
        let cost = order["CHF_FLOAT"];
        let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;

        // Get total quantity (product quantity x erp order quantity)
        let totalQuantity = order["total_quantity"];
        // if (order['product_quantity']) {
        //   totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
        // }

        // Measure
        let measure = null;
        if (order["products"] && order["products"].length) {
          if (order["products"][0]["normalisedMeasure"]) {
            measure = order["products"][0]["normalisedMeasure"];
          }
        }

        // Properties
        let properties = {};
        if (order["products"] && order["products"].length) {
          if (order["product_numeric_properties"]) {
            _.each(order["product_numeric_properties"], (p) => {
              let property = {
                // magnitude: p.propertyValue * orderQuantity,
                magnitude: p.propertyValue,
                property_type: p.propertyName,
                unit: p.propertyUnit,
              };
              properties[p.propertyName] = property;
            });
          }
        }
        order["properties"] = properties;

        // Get x value
        if (this.xType === "Quantity") {
          x = totalQuantity;
        } else {
          if (measure && measure["entity"] === this.xType) {
            // x = measure['normalisedUnitMagnitude'];
            x = measure["normalisedUnitMagnitude"] * orderQuantity;
          } else {
            x = null;
          }
        }

        // let opacity = 0.65;
        let opacity = 0.7;
        let selectedOrderIds = _.map(this.selectedOrders, "_id");
        if (selectedOrderIds.includes(order["_id"])) {
          opacity = 0.9;
        }

        let color = "Other";
        if (this.selectedColourByOption !== null) {
          let key = this.selectedColourByOption.key;
          if (key in order) {
            color = order[key];
          } else {
            let colourByProperty = _.find(order["product_categorical_properties"], (p) => {
              return p["propertyName"] === this.selectedColourByOption.key;
            });
            if (colourByProperty) {
              color = colourByProperty["propertyValue"];
            }
          }
        }

        // Size by
        let size = null;
        if (this.selectedSizeByOption) {
          let sizeByProperty = _.find(order["product_numeric_properties"], (p) => {
            return p["propertyName"] === this.selectedSizeByOption;
          });
          if (sizeByProperty) {
            size = sizeByProperty["propertyValue"];
          } else {
            size = 0;
          }
        }

        // Order date
        let orderDate = null;
        let orderDateMoment = null;
        if (
          order["PO Initial Create Date"] &&
          order["PO Initial Create Date"]["$date"] &&
          order["PO Initial Create Date"]["$date"]["$numberLong"]
        ) {
          orderDateMoment = moment.unix(Number(order["PO Initial Create Date"]["$date"]["$numberLong"]) / 1000);
          orderDate = orderDateMoment.format("DD/MM/YYYY");
        }

        gd.push({
          id: order["_id"],
          // description: order['PO Li Description'],
          description: order["product_name"],
          vendor: order["Vendor"] ? order["Vendor"] : "-",
          order_date: orderDate ? orderDate : "-",
          order_date_moment: orderDateMoment,
          quantity: totalQuantity,
          measure: measure,
          cost: cost,
          cost_per_unit: x ? cost / x : cost,
          properties: properties,
          x: x,
          opacity: opacity,
          color: color,
          size: size,
        });
      });

      return gd;
    },

    xOptions() {
      let options = ["Quantity"];
      // _.each(this.graphData, gd => {
      //   let propertyLabels = Object.keys(gd['properties']);
      //   options.push(propertyLabels);
      //   options = _.flatten(options);
      // });
      _.each(this.graphData, (gd) => {
        if (gd["measure"] !== null) {
          options.push(gd["measure"]["entity"]);
        }
      });
      return _.uniq(options);
    },

    pointTooltip() {
      return [
        "description*x*cost_per_unit*order_date*vendor",
        (description, x, cost_per_unit, order_date, vendor) => {
          if (x < 1 && x !== 0) {
            // x = Number.parseFloat(x).toExponential(3);
            let exp = Number.parseFloat(x).toExponential(3);
            let split = exp.split("e");
            x = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
          }
          return {
            name: description,
            // x: this.xLabel + ': ' +x,
            x_description: "<b>" + this.formatGraphLabel(this.xLabel) + ": " + "</b>" + x + " " + this.xUnit,
            cost_per_unit:
              "<b>Cost per " +
              this.costPerLabel +
              ": </b>" +
              this.formatCostGraph({
                cost: cost_per_unit,
                cost_currency: "USD",
              }),
            order_date: "<b>Order date: </b>" + order_date,
            vendor: "<b>Vendor: </b>" + vendor,
            value:
              this.xLabel +
              " (" +
              x +
              "), " +
              "Cost per unit " +
              "(" +
              this.formatCostGraph({
                cost: cost_per_unit,
                cost_currency: "USD",
              }) +
              ")",
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
      },
    },
  },

  data() {
    return {
      // xType: 'Quantity',
      height: 500,
      tooltipCrosshairs: { type: "cross" },
      tooltipItemTpl: `
        <li data-index={index} style="margin-bottom:4px;">
          <span style="background-color:{color};" class="g2-tooltip-marker"></span>
          <b>{name}</b><br />
          {x_description}<br />
          {cost_per_unit}<br />
          {order_date}<br />
          {vendor}
        </li>
      `,
    };
  },

  created() {
    this.setXOptions(this.xOptions);
    this.selectXOption("Quantity");

    if (!this.start_date) {
      this.start_date = this.earliestDate.clone();
    }
    if (!this.end_date) {
      this.end_date = this.latestDate.clone();
    }
  },

  methods: {
    ...mapActions("clusterViewer", {
      toggleOrderSelected: "toggleOrderSelected",
      setXOptions: "setXOptions",
      selectXOption: "selectXOption",
      setStartDate: "setStartDate",
      setEndDate: "setEndDate",
    }),

    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    },

    formatCostGraph(order) {
      if (order.cost) {
        let currency = order.cost_currency ? order.cost_currency : "GBP";
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(order.cost);
      }
      return order.cost;
    },

    handlePointClicked(point) {
      let orderId = point["data"]["_origin"]["id"];
      let order = _.find(this.orders, { _id: orderId });
      // console.log(order);
      this.toggleOrderSelected(order);
    },
  },
};
</script>

<style scoped>
.top-toolbar {
  margin-bottom: 30px;
  /*float: right;*/
}
</style>
