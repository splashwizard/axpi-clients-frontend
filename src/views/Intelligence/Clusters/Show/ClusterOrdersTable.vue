<template>
  <a-table
    class="axpi-table"
    :scroll="{ x: 1300 }"
    :columns="columns"
    :row-key="(record) => record.id"
    @change="handleTableChange"
    :data-source="dataToShow"
    :loading="loading"
  >
    <div slot="name" slot-scope="name, record">
      <div class="product-name-wrapper">
        <div class="left">
          <a target="_blank" :href="getFirstProduct(record) ? getFirstProduct(record)['URL'] : '#'">
            <a-avatar style="margin-right: 20px" size="large" :src="getImageSrc(getFirstProduct(record))" />
          </a>
        </div>
        <div class="right">
          <a v-if="getFirstProduct(record)" target="_blank" :href="getProductLink(getFirstProduct(record))">
            {{ name }}
          </a>
          <span v-else>{{ record["PO Li Description"] }}</span>
        </div>
      </div>
    </div>
    <div slot="datePurchased" slot-scope="datePurchased">
      {{ formatDatePurchased(datePurchased) }}
    </div>
    <div slot="quantity" slot-scope="quantity, order">
      {{ getQuantity(order) }}
    </div>
    <div slot="cost" slot-scope="cost">
      {{ formatCost({ cost: cost, cost_currency: "USD" }) }}
    </div>
    <div slot="potentialSavings" slot-scope="potentialSavings, record">
      <span v-if="calculateMaxPotentialSavings(record)">
        <span
          v-if="
            calculateMinPotentialSavings(record) !== calculateMaxPotentialSavings(record) &&
            Math.round(calculateMinPotentialSavings(record)) !== 0
          "
        >
          {{ formatCost({ cost: calculateMinPotentialSavings(record), cost_currency: "USD" }) }} -
        </span>
        {{ formatCost({ cost: calculateMaxPotentialSavings(record), cost_currency: "USD" }) }}
      </span>
      <span v-else></span>
    </div>
    <div slot="normalisedMeasure" slot-scope="normalisedMeasure, record">
      <span v-html="getNormalisedMeasure(record)"></span>
    </div>
    <div slot="productUnitOfMeasure" slot-scope="productUnitOfMeasure, record">
      <span v-html="getFirstProductUnitOfMeasure(record)"></span>
    </div>
    <div class="insights-column" slot="insights" slot-scope="insights, record">
      <a style="margin-right: 15px" href="#" @click.prevent="handleRecordSelected(record)">
        <a-icon type="eye" style="margin-right: 4px" />
        View
      </a>

      <a-dropdown :trigger="['click']">
        <a-button type="link" icon="ellipsis" @click.prevent="(e) => e.preventDefault()"></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="#" @click.prevent="editMatch(record)">Edit Match</a>
          </a-menu-item>
          <a-menu-item>
            <a href="#" class="text-danger" @click.prevent="deleteRecord(record)">Remove</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <!--    <div slot="actions" class="table-actions" slot-scope="actions, record">-->

    <!--    </div>-->
  </a-table>
</template>
<script>
import Orders from "../../../../mixins/Orders";
import Units from "../../../../mixins/Units";
import { mapGetters, mapActions } from "vuex";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

const _ = require("lodash");

export default {
  props: ["clusterId"],
  mixins: [Orders, Units],
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  methods: {
    ...mapActions("clusterViewer", {
      setSortField: "setSortField",
      setSortOrder: "setSortOrder",
      setFilters: "setFilters",
    }),

    editMatch(order) {
      window.open("/matcher?erpOrderId=" + order["_id"]);
    },

    deleteRecord(order) {
      this.$emit("remove-order", order);
    },

    handleRecordSelected(record) {
      this.$emit("record-selected", record);
    },

    getFirstProduct(record) {
      return record["products"][0];
    },

    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    getQuantity(order) {
      // if (order["products"] && order["products"].length) {
      //   if (order["products"][0] && order["products"][0]["normalisedQuantity"] && order["products"][0]["normalisedQuantity"]['totalQuantity'] && order["products"][0]["normalisedQuantity"]["totalQuantity"]["normalisedUnitMagnitude"]) {
      //     order['product_quantity'] = order['products'][0]['normalisedQuantity']['totalQuantity']['normalisedUnitMagnitude'];
      //   }
      // }
      //
      // let orderQuantity = order["Quantity"] !== "None" ? Number(order["Quantity"]) : 1;
      // let totalQuantity = orderQuantity;
      // if (order['product_quantity']) {
      //   totalQuantity = Number(orderQuantity) * Number(order['product_quantity']);
      // }
      //
      // return totalQuantity;

      return order["total_quantity"] ? order["total_quantity"] : Number(order["Quantity"]);
    },

    calculateMinPotentialSavings(order) {
      let insights = _.filter(this.insights, (insight) => {
        return insight["erp_order_id"] == order["_id"];
      });

      let potentialSavings = 0;
      let groupedByType = _.groupBy(insights, "insight_type");
      _.each(groupedByType, (insightsForType) => {
        let max = _.min(_.map(insightsForType, "potential_savings"));
        potentialSavings += max;
      });

      return potentialSavings;
    },

    calculateMaxPotentialSavings(order) {
      let insights = _.filter(this.insights, (insight) => {
        return insight["erp_order_id"] == order["_id"];
      });

      let potentialSavings = 0;
      let groupedByType = _.groupBy(insights, "insight_type");
      _.each(groupedByType, (insightsForType) => {
        let max = _.max(_.map(insightsForType, "potential_savings"));
        potentialSavings += max;
      });

      return potentialSavings;
    },

    formatDatePurchased(datePurchased) {
      if (datePurchased["$date"] && datePurchased["$date"]["$numberLong"]) {
        let timestamp = datePurchased["$date"]["$numberLong"] / 1000;
        return moment.unix(timestamp).format("DD/MM/YYYY");
      }
      return "-";
    },

    getNormalisedMeasureMagnitude(order) {
      let orderQuantity = order["Quantity"] !== "None" ? Number(order["Quantity"]) : 1;
      let product = this.getFirstProduct(order);
      let toReturn = null;
      if (product && product["normalisedMeasure"]) {
        let magnitude = product["normalisedMeasure"]["normalisedUnitMagnitude"];
        if (magnitude) {
          toReturn = magnitude * orderQuantity;
        }
      }
      return toReturn;
    },

    getFirstProductUnitOfMeasure(order) {
      let product = this.getFirstProduct(order);
      if (product && product["normalisedQuantity"]) {
        return product["normalisedQuantity"]["unit"];
      }
      return null;
    },

    getNormalisedMeasure(order) {
      let orderQuantity = order["Quantity"] !== "None" ? Number(order["Quantity"]) : 1;
      let product = this.getFirstProduct(order);

      let toReturn = null;
      if (product && product["normalisedMeasure"] && product["normalisedMeasure"]) {
        let magnitude = product["normalisedMeasure"]["normalisedUnitMagnitude"] * orderQuantity;
        // let magnitude = product['normalisedQuantity']['totalMeasure']['rawMagnitude'];
        let unit = product["normalisedMeasure"]["normalisedUnitBase"];

        if (magnitude && unit) {
          if (magnitude < 1) {
            // magnitude = Number.parseFloat(magnitude).toExponential(3);
            let exp = Number.parseFloat(magnitude).toExponential(3);
            let split = exp.split("e");
            magnitude = split[0] + " x 10" + "<sup>" + split[1] + "</sup>";
          }
          // toReturn = String(magnitude) + ' ' + (unit !== 'dimensionless' ? unit : null);
          toReturn = String(magnitude) + " " + this.formatUnit(unit);
        }
      }
      if (toReturn) {
        return toReturn;
      }
      return "";
    },

    getProductLink(product) {
      return "/products/" + product["_id"];
    },

    // handleTableChange(pagination, filters, sorter) {
    //   console.log(pagination);
    //   const pager = {...this.pagination};
    //   pager.current = pagination.current;
    //   this.pagination = pager;
    //   this.fetch({
    //     results: pagination.pageSize,
    //     page: pagination.current,
    //     sortField: sorter.field,
    //     sortOrder: sorter.order,
    //     ...filters,
    //   });
    // }

    handleTableChange(pagination, filters, sorter) {
      // this.sortField = sorter.field;
      // this.sortOrder = sorter.order;
      // this.filters = filters;
      this.setSortField(sorter.field);
      this.setSortOrder(sorter.order);
      this.setFilters(filters);
    },
  },
  computed: {
    ...mapGetters("clusterViewer", {
      selectedOrders: "selectedOrders",
      ordersWithMatches: "ordersWithMatches",
      ordersWithMatchesFiltered: "ordersWithMatchesFiltered",
      insights: "insights",
      sortField: "sortField",
      sortOrder: "sortOrder",
      filters: "filters",
      startDate: "startDate",
      endDate: "endDate",
    }),

    columns() {
      return [
        {
          title: "Name",
          // sorter: true,
          dataIndex: "product_name",
          scopedSlots: { customRender: "name" },
          fixed: "left",
          width: 350,
          sorter: true,
          filters: _.map(this.productNameOptions, (o) => {
            return {
              text: o,
              value: o,
            };
          }),
        },
        {
          title: "Date Purchased",
          dataIndex: "PO Initial Create Date",
          scopedSlots: { customRender: "datePurchased" },
          sorter: true,
          width: 160,
        },
        {
          title: "Quantity",
          dataIndex: "total_quantity",
          // scopedSlots: {customRender: 'quantity'},
          sorter: true,
          width: 110,
        },
        {
          title: "Cost",
          // dataIndex: "Cost",
          dataIndex: "CHF_FLOAT",
          scopedSlots: { customRender: "cost" },
          sorter: true,
          width: 110,
        },
        {
          title: "Potential Savings",
          dataIndex: "Potential Savings",
          scopedSlots: { customRender: "potentialSavings" },
          sorter: true,
          width: 150,
        },
        {
          title: "Measure",
          dataIndex: "Measure",
          scopedSlots: { customRender: "normalisedMeasure" },
          sorter: true,
          width: 170,
        },
        {
          title: "PO Number",
          dataIndex: "PO Number",
          width: 130,
          sorter: true,
        },
        {
          title: "PO Name",
          dataIndex: "PO Li Description",
          sorter: true,
          width: 300,
        },
        {
          title: "Product Code",
          dataIndex: "product_code",
          // scopedSlots: {customRender: 'productCode'},
          sorter: true,
          width: 150,
        },
        // {
        //   title: "PO Number",
        //   dataIndex: "PO Number",
        //   sorter: true,
        // },
        {
          title: "Vendor",
          dataIndex: "Vendor",
          width: 200,
          filters: _.map(this.vendorFilterOptions, (o) => {
            return {
              text: o,
              value: o,
            };
          }),
        },
        {
          title: "BU of Measure",
          dataIndex: "BU of Measure",
          width: 150,
        },
        {
          title: "Product Unit of Measure",
          dataIndex: "Product Unit of Measure",
          scopedSlots: { customRender: "productUnitOfMeasure" },
          width: 200,
        },
        {
          title: "Insights",
          scopedSlots: { customRender: "insights" },
          fixed: "right",
          width: 140,
        },
        // {
        //   title: "",
        //   scopedSlots: {customRender: "actions"},
        //   width: 10,
        //   fixed: 'right'
        // },
      ];
    },

    vendorFilterOptions() {
      return _.uniq(_.map(this.ordersWithMatches, "Vendor"));
    },

    productNameOptions() {
      return _.uniq(_.map(this.ordersWithMatches, "product_name"));
    },

    dataToShow() {
      let dataToShow = [];

      if (this.selectedOrders.length) {
        let ids = _.map(this.selectedOrders, "_id");
        dataToShow = _.filter(this.ordersWithMatchesFiltered, (d) => {
          return ids.includes(d["_id"]);
        });
      } else {
        dataToShow = this.ordersWithMatchesFiltered;
      }

      // Filter by date
      dataToShow = _.filter(dataToShow, (d) => {
        // Order date
        let orderDate = null;
        let orderDateMoment = null;
        if (
          d["PO Initial Create Date"] &&
          d["PO Initial Create Date"]["$date"] &&
          d["PO Initial Create Date"]["$date"]["$numberLong"]
        ) {
          orderDateMoment = moment.unix(Number(d["PO Initial Create Date"]["$date"]["$numberLong"]) / 1000);
          orderDate = orderDateMoment.format("DD/MM/YYYY");
        }
        d.order_date = orderDate;
        d.order_date_moment = orderDateMoment;

        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.startDate) {
          if (d.order_date_moment.isBefore(this.startDate)) {
            return false;
          }
        }
        if (d.order_date_moment && moment(d.order_date_moment).isValid() && this.endDate) {
          if (d.order_date_moment.isAfter(this.endDate)) {
            return false;
          }
        }
        return true;
      });

      let sortOrder = this.sortOrder === "ascend" ? "asc" : "desc";
      switch (this.sortField) {
        case "product_name":
          dataToShow = _.orderBy(dataToShow, "product_name", sortOrder);
          break;
        case "Potential Savings":
          dataToShow = _.map(dataToShow, (d) => {
            d.maxSaving = this.calculateMaxPotentialSavings(d);
            return d;
          });
          dataToShow = _.orderBy(dataToShow, "maxSaving", sortOrder);
          break;
        case "Measure":
          dataToShow = _.map(dataToShow, (d) => {
            d.measureMagnitude = this.getNormalisedMeasureMagnitude(d);
            return d;
          });
          dataToShow = _.orderBy(dataToShow, "measureMagnitude", sortOrder);
          break;
        case "PO Initial Create Date":
          dataToShow = _.map(dataToShow, (d) => {
            if (
              d["PO Initial Create Date"] &&
              d["PO Initial Create Date"]["$date"] &&
              d["PO Initial Create Date"]["$date"]["$numberLong"]
            ) {
              d.timestamp = d["PO Initial Create Date"]["$date"]["$numberLong"];
            } else {
              d.timestamp = null;
            }
            return d;
          });
          dataToShow = _.orderBy(dataToShow, "timestamp", sortOrder);
          break;
        case "total_quantity":
          dataToShow = _.orderBy(dataToShow, "total_quantity", sortOrder);
          break;
        case "Cost":
          dataToShow = _.orderBy(dataToShow, "Cost", sortOrder);
          break;
        case "CHF_FLOAT":
          dataToShow = _.orderBy(dataToShow, "CHF_FLOAT", sortOrder);
          break;
        case "PO Number":
          dataToShow = _.orderBy(dataToShow, "PO Number", sortOrder);
          break;
        case "PO Li Description":
          dataToShow = _.orderBy(dataToShow, "PO Li Description", sortOrder);
          break;
        case "product_code":
          dataToShow = _.orderBy(dataToShow, "product_code", sortOrder);
          break;
        default:
          break;
      }

      return dataToShow;
    },
  },
};
</script>
<style scoped lang="scss">
.product-name-wrapper {
  display: flex;
  flex-direction: row;

  .left {
    flex-shrink: 1;
    display: flex;
    align-items: center;
  }

  .right {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}

.insights-column {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
