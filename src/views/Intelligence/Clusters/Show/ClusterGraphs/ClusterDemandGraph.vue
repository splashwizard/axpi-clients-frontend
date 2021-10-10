<template>
  <div>
    <div class="top-toolbar">
      <a-date-picker
          v-model="startDate"
          placeholder="Start"
      />
      <span class="separator">
        -
      </span>
      <a-date-picker
          v-model="endDate"
          placeholder="End"
      />
    </div>

    <v-chart
        :key="graphReloadKey"
        :forceFit="true"
        renderer="svg"
        height="400"
        :scale="scale"
        :data="graphDataToShow">
      <v-axis dataKey="quantity" :title="{'text': 'Quantity'}"></v-axis>
      <v-axis dataKey="order_date" :title="{'text': 'Order Date'}"
              :tick="{'tickCount': 3}"></v-axis>
      <v-tooltip></v-tooltip>
      <v-interval
          position="order_date*quantity"
          :opacity="1"
      />
    </v-chart>
  </div>
</template>

<script>
const _ = require('lodash');
import Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

export default {
  name: "ClusterDemandGraph",
  props: ["orders", "graphReloadKey"],
  data() {
    return {
      startDate: null,
      endDate: null
    }
  },
  created() {
    this.startDate = this.earliestDate.clone();
    this.endDate = this.latestDate.clone();
  },
  computed: {
    scale() {
      return [
        {
          dataKey: 'order_date',
          tickCount: 10
        }
      ]
    },

    graphData() {
      let gd = [];

      _.each(this.orders, order => {
        // Let's computed total quantity for each order
        if (order["products"] && order["products"].length) {
          if (order["products"][0]["normalisedQuantity"]) {
            order['product_quantity'] = order['products'][0]['normalisedQuantity']['normalisedUnitMagnitude'];
          }
        }
        let orderQuantity = order["Quantity"] !== "None" ? order["Quantity"] : 1;
        let totalQuantity = orderQuantity;
        if (order['product_quantity']) {
          totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
        }
        order["total_quantity"] = totalQuantity;

        // Now let's convert the timestamps into moment
        let orderDate = null;
        let orderDateMoment = null;
        if (order["PO Initial Create Date"] && order["PO Initial Create Date"]["$date"] && order["PO Initial Create Date"]["$date"]["$numberLong"]) {
          orderDateMoment = moment.unix(
              Number(order["PO Initial Create Date"]["$date"]["$numberLong"]) / 1000
          );
          orderDate = orderDateMoment.format("DD/MM/YYYY")
        }
        order["order_date_moment"] = orderDateMoment;
        order["order_date"] = orderDate;

        gd.push({
          '_id': order['_id'],
          'order_date': order['order_date'],
          'order_date_moment': order['order_date_moment'],
          'quantity': order['total_quantity']
        });
      });

      let groupedByDate = _.groupBy(gd, 'order_date');

      let graphPoints = [];
      _.each(groupedByDate, (orders, date) => {
        let summedQuantity = _.sum(_.map(orders, 'quantity'));
        graphPoints.push({
          order_date: date,
          order_date_moment: orders[0]['order_date_moment'],
          quantity: summedQuantity
        });
      });

      return graphPoints;
    },

    datesFromGraphData() {
      return _.map(this.graphData, 'order_date_moment');
    },

    earliestDate() {
      return moment.min(this.datesFromGraphData);
    },

    latestDate() {
      return moment.max(this.datesFromGraphData);
    },

    graphDateRange() {
      let startDate = this.startDate;
      let endDate = this.endDate;

      if (!startDate) {
        startDate = this.earliestDate;
      }
      if (!endDate) {
        endDate = this.latestDate;
      }

      return moment.range(startDate, endDate);
    },

    graphDateRangeByDays() {
      return Array.from(this.graphDateRange.by('days'));
    },

    graphDataToShow() {
      let points = [];

      _.each(this.graphDateRangeByDays, date => {
        let dateFormatted = date.format('DD/MM/YYYY');
        let pointFromData = _.find(this.graphData, {
          order_date: dateFormatted
        });
        if (pointFromData) {
          points.push(pointFromData);
        } else {
          points.push({
            order_date: dateFormatted,
            quantity: 0
          });
        }
      });

      return points;
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.top-toolbar {
  margin-bottom: 30px;
}

.separator {
  display: inline-block;
  padding-left: 12px;
  padding-right: 12px;
}
</style>