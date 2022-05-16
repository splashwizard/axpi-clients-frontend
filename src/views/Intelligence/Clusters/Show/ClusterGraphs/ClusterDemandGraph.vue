<template>
  <div>
    <!--    <div class="top-toolbar">-->
    <!--      <a-date-picker-->
    <!--          v-model="start_date"-->
    <!--          placeholder="Start"-->
    <!--      />-->
    <!--      <span class="separator">-->
    <!--        - -->
    <!--      </span>-->
    <!--      <a-date-picker-->
    <!--          v-model="end_date"-->
    <!--          placeholder="End"-->
    <!--      />-->
    <!--    </div>-->

    <v-chart :key="graphReloadKey" :forceFit="true" renderer="svg" height="400" :scale="scale" :data="graphDataToShow">
      <v-axis
        dataKey="quantity"
        :title="{ text: formatGraphLabel(xLabel) + (xUnit ? ' (' + xUnit + ')' : '') }"
      ></v-axis>
      <v-axis dataKey="order_date" :title="{ text: 'Order Date' }" :tick="{ tickCount: 3 }"></v-axis>
      <v-tooltip :showTitle="false" :itemTpl="tooltipItemTpl"></v-tooltip>
      <v-interval :tooltip="intervalTooltip" position="order_date*quantity" :opacity="1" />
    </v-chart>
  </div>
</template>

<script>
const _ = require("lodash");
import Moment from "moment";
import { extendMoment } from "moment-range";
import { mapGetters, mapActions } from "vuex";

const moment = extendMoment(Moment);

export default {
  name: "ClusterDemandGraph",
  props: ["orders", "graphReloadKey"],
  data() {
    return {
      tooltipItemTpl: `
        <li data-index={index} style="margin-bottom:4px;">
          <span style="background-color:{color};" class="g2-tooltip-marker"></span>
          <b>{name}</b><br />
          {value}
        </li>
      `,
    };
  },
  created() {
    // this.start_date = this.earliestDate.clone();
    // this.end_date = this.latestDate.clone();
  },
  computed: {
    ...mapGetters("clusterViewer", {
      selectedBinByOption: "selectedBinByOption",
      startDate: "startDate",
      endDate: "endDate",
      selectedXOption: "selectedXOption",
    }),

    xType: {
      get() {
        return this.selectedXOption;
      },
      set(val) {
        this.selectXOption(val);
      },
    },

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

    scale() {
      return [
        {
          dataKey: "order_date",
          tickCount: 10,
        },
      ];
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

    graphData() {
      let gd = [];

      let orders = _.filter(this.orders, (order) => {
        return (
          order["PO Initial Create Date"] &&
          order["PO Initial Create Date"]["$date"] &&
          order["PO Initial Create Date"]["$date"]["$numberLong"]
        );
      });

      _.each(orders, (order) => {
        // Now let's convert the timestamps into moment
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
        order["order_date_moment"] = orderDateMoment;
        order["order_date"] = orderDate;

        // Measure
        let measure = null;
        if (order["products"] && order["products"].length) {
          if (order["products"][0]["normalisedMeasure"]) {
            measure = order["products"][0]["normalisedMeasure"];
          }
        }

        let quantity = null;
        if (this.xType === "Quantity") {
          quantity = order["total_quantity"];
        } else if (measure && measure["entity"] === this.xType) {
          let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;
          quantity = measure["normalisedUnitMagnitude"] * orderQuantity;
        }

        if (quantity !== null) {
          gd.push({
            _id: order["_id"],
            order_date: order["order_date"],
            order_date_moment: order["order_date_moment"],
            quantity: quantity,
          });
        }
      });

      let graphPoints = [];
      let groupedByDate = _.groupBy(gd, "order_date");
      _.each(groupedByDate, (orders, date) => {
        let summedQuantity = _.sum(_.map(orders, "quantity"));
        graphPoints.push({
          order_date: date,
          order_date_moment: orders[0]["order_date_moment"],
          quantity: summedQuantity,
        });
      });

      return graphPoints;
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

    graphDateRangeByDays() {
      return Array.from(this.graphDateRange.by("days"));
    },

    graphDateRangeByMonths() {
      return Array.from(this.graphDateRange.by("months"));
    },

    graphDateRangeByYears() {
      return Array.from(this.graphDateRange.by("years"));
    },

    graphDataToShow() {
      let points = [];

      if (this.selectedBinByOption === "day") {
        _.each(this.graphDateRangeByDays, (date) => {
          let dateFormatted = date.format("DD/MM/YYYY");
          let pointFromData = _.find(this.graphData, {
            order_date: dateFormatted,
          });
          if (pointFromData) {
            points.push(pointFromData);
          } else {
            points.push({
              order_date: dateFormatted,
              quantity: 0,
            });
          }
        });
      }

      if (this.selectedBinByOption === "month") {
        _.each(this.graphDateRangeByMonths, (date) => {
          let beginningOfMonth = moment(date).startOf("month");
          let endOfMonth = moment(date).endOf("month");
          let monthRange = moment.range(beginningOfMonth, endOfMonth);

          let daysData = [];
          _.each(Array.from(monthRange.by("days")), (date) => {
            let dateFormatted = date.format("DD/MM/YYYY");
            let pointFromData = _.find(this.graphData, {
              order_date: dateFormatted,
            });
            daysData.push(pointFromData);
          });

          if (daysData) {
            points.push({
              order_date: beginningOfMonth.format("MM/YYYY"),
              quantity: _.sum(_.map(daysData, "quantity")),
            });
          }
        });
      }

      if (this.selectedBinByOption === "year") {
        _.each(this.graphDateRangeByYears, (date) => {
          let beginningOfYear = moment(date).startOf("year");
          let endOfYear = moment(date).endOf("year");
          let monthRange = moment.range(beginningOfYear, endOfYear);

          let daysData = [];
          _.each(Array.from(monthRange.by("days")), (date) => {
            let dateFormatted = date.format("DD/MM/YYYY");
            let pointFromData = _.find(this.graphData, {
              order_date: dateFormatted,
            });
            daysData.push(pointFromData);
          });

          if (daysData) {
            points.push({
              order_date: beginningOfYear.format("YYYY"),
              quantity: _.sum(_.map(daysData, "quantity")),
            });
          }
        });
      }

      return points;
    },

    intervalTooltip() {
      return [
        "order_date*quantity",
        (order_date, quantity) => {
          if (quantity < 1 && quantity !== 0) {
            // x = Number.parseFloat(x).toExponential(3);
            let exp = Number.parseFloat(quantity).toExponential(3);
            let split = exp.split("e");
            quantity = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
          }
          return {
            name: order_date,
            value: quantity + " " + this.xUnit,
          };
        },
      ];
    },
  },
  methods: {
    ...mapActions("clusterViewer", {
      setStartDate: "setStartDate",
      setEndDate: "setEndDate",
      selectXOption: "selectXOption",
    }),

    formatGraphLabel(label) {
      return label.charAt(0).toUpperCase() + label.substring(1);
    },
  },
};
</script>

<style scoped>
.top-toolbar {
  margin-bottom: 30px;
  /*float: right;*/
}

.separator {
  display: inline-block;
  padding-left: 12px;
  padding-right: 12px;
}
</style>
