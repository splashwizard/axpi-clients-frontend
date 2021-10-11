<template>
  <a-table
      class="axpi-table"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :loading="loading"
  >
    <div slot="name" slot-scope="name, record">
      <div class="product-name-wrapper">
        <div class="left">
          <a-avatar style="margin-right: 20px;"
                    size="large" :src="getImageSrc(getFirstProduct(record))"/>
        </div>
        <div class="right">
          {{ getFirstProduct(record) ? getFirstProduct(record)['Name'] : name }}
        </div>
      </div>
    </div>
    <div slot="productCode" slot-scope="name, record">
      {{ getFirstProduct(record) ? getFirstProduct(record)['Product_Code'] : '-' }}
    </div>
    <div slot="datePurchased" slot-scope="datePurchased">
      {{ formatDatePurchased(datePurchased) }}
    </div>
    <div slot="quantity" slot-scope="quantity, order">
      {{ getQuantity(order) }}
    </div>
    <div slot="cost" slot-scope="cost">
      {{ formatCost({cost: cost, cost_currency: 'USD'}) }}
    </div>
    <div slot="potentialSavings" slot-scope="potentialSavings, record">
      <span v-if="calculateMaxPotentialSavings(record)">
        <span
            v-if="calculateMinPotentialSavings(record) !== calculateMaxPotentialSavings(record) && Math.round(calculateMinPotentialSavings(record)) !== 0">
          {{ formatCost({cost: calculateMinPotentialSavings(record), cost_currency: 'USD'}) }} -
        </span>
        {{ formatCost({cost: calculateMaxPotentialSavings(record), cost_currency: 'USD'}) }}
      </span>
      <span v-else>-</span>
    </div>
    <div slot="insights" slot-scope="insights, record">
      <a href="#" @click.prevent="handleRecordSelected(record)">
        <a-icon type="eye" style="margin-right: 4px;"/>
        View
      </a>
    </div>
    <div slot="actions" class="table-actions" slot-scope="actions, record">
      <a-dropdown :trigger="['click']">
        <a-button
            type="link"
            icon="ellipsis"
            @click.prevent="(e) => e.preventDefault()"
        ></a-button>
        <a-menu slot="overlay">
          <a-menu-item>
            <a
                href="#"
                class="text-danger"
                @click.prevent="deleteRecord(record)"
            >Remove</a
            >
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-table>
</template>
<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";
import moment from 'moment';

const _ = require('lodash');

const columns = [
  {
    title: "Name",
    dataIndex: "PO Li Description",
    sorter: true,
    scopedSlots: {customRender: 'name'}
  },
  {
    title: "PO Number",
    dataIndex: "PO Number"
  },
  // {
  //   title: "Product Code",
  //   scopedSlots: {customRender: 'productCode'}
  // },
  {
    title: "Date Purchased",
    dataIndex: "PO Initial Create Date",
    scopedSlots: {customRender: 'datePurchased'}
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    scopedSlots: {customRender: 'quantity'}
  },
  {
    title: "Cost",
    dataIndex: "Cost",
    scopedSlots: {customRender: 'cost'}
  },
  {
    title: "Potential Savings",
    scopedSlots: {customRender: 'potentialSavings'}
  },
  // {
  //   title: "PO Number",
  //   dataIndex: "PO Number",
  //   sorter: true,
  // },
  {
    title: "Insights",
    scopedSlots: {customRender: 'insights'}
  },
  {
    title: "",
    scopedSlots: {customRender: "actions"},
    width: 10,
  },
];

export default {
  props: ["clusterId", "insights"],
  mixins: [Orders],
  data() {
    return {
      data: [],
      loading: false,
      columns,
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      axios
          .get(
              window.API_BASE +
              "/intelligence/clusters/" +
              this.clusterId +
              "/orders-with-matches"
          )
          .then((r) => {
            this.loading = false;
            this.data = r.data;
          })
          .catch((e) => {
            console.log(e);
            this.$message.error("Error loading orders");
          });
    },

    deleteRecord(order) {
      this.$emit("remove-order", order);
    },

    handleRecordSelected(record) {
      this.$emit('record-selected', record);
    },

    getFirstProduct(record) {
      return record["products"][0];
    },

    getImageSrc(product) {
      if (product["Images"] && product["Images"].length) {
        return product["Images"][0];
      }
    },

    getQuantity(order) {
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

      return totalQuantity;
    },

    calculateMinPotentialSavings(order) {
      let insights = _.filter(this.insights, insight => {
        return insight['erp_order_id'] == order['_id'];
      });

      let potentialSavings = 0;
      let groupedByType = _.groupBy(insights, 'insight_type');
      _.each(groupedByType, insightsForType => {
        let max = _.min(
            _.map(insightsForType, 'potential_savings')
        );
        potentialSavings += max;
      });

      return potentialSavings;
    },

    calculateMaxPotentialSavings(order) {
      let insights = _.filter(this.insights, insight => {
        return insight['erp_order_id'] == order['_id'];
      });

      let potentialSavings = 0;
      let groupedByType = _.groupBy(insights, 'insight_type');
      _.each(groupedByType, insightsForType => {
        let max = _.max(
            _.map(insightsForType, 'potential_savings')
        );
        potentialSavings += max;
      });

      return potentialSavings;
    },

    formatDatePurchased(datePurchased) {
      let timestamp = datePurchased['$date']['$numberLong'] / 1000;
      return moment.unix(timestamp).format('DD/MM/YYYY');
    }
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
</style>