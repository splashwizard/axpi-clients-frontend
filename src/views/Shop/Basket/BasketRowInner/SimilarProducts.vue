<template>
  <a-table
    class="similar-products-row"
    slot="expandedRowRender"
    :columns="columns"
    :loading="row.isLoadingSuggestedProducts"
    :data-source="similarProducts"
    :pagination="false"
  >
    <div slot="productName" slot-scope="productName">
      {{ productName }}
      <a-tag v-if="row.itemType == 'order'" style="margin-left: 5px" color="blue">Past Order</a-tag>
    </div>
    <div slot="orderDate" slot-scope="orderDate">
      {{ orderDate ? formatDate(orderDate) : "-" }}
    </div>
    <div slot="cost" slot-scope="cost, order">
      {{ formatCostInPence2dp(order) }}
    </div>
    <div slot="similarity" slot-scope="similarity">
      <a-progress type="circle" :width="38" style="float: right" :percent="similarity" />
    </div>
    <div slot="compare">
      <a-button icon="eye" style="float: right">Compare</a-button>
    </div>
  </a-table>
</template>

<script>
import Dates from "../../../../mixins/Dates";
import Orders from "../../../../mixins/Orders";
import suppliers from "../../../../helpers/suppliers";

const _ = require("lodash");

export default {
  name: "SimilarProducts",
  props: ["row"],
  mixins: [Dates, Orders],
  data() {
    return {};
  },
  computed: {
    columns() {
      let columns = [
        {
          title: "Name",
          dataIndex: "product_name",
          scopedSlots: { customRender: "productName" },
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
        },
        {
          title: "Supplier",
          dataIndex: "supplier.name",
        },
      ];
      if (this.row.itemType == "order") {
        columns.push({
          title: "Order Date",
          dataIndex: "order_date",
          scopedSlots: { customRender: "orderDate" },
        });
      }
      columns.push({
        title: "Cost",
        dataIndex: "cost",
        scopedSlots: { customRender: "cost" },
      });
      columns.push({
        title: "",
        dataIndex: "similarity",
        scopedSlots: { customRender: "similarity" },
      });
      columns.push({
        title: "",
        scopedSlots: { customRender: "compare" },
      });

      return columns;
    },

    similarProducts() {
      if (this.row.itemType == "order") {
        return [
          {
            ...this.row.order,
            supplier: { name: suppliers.formatSupplierName(this.row.order.supplier.name) },
            similarity: 100,
          },
          {
            product_name: "Smirnoff Poster",
            quantity: 1215983,
            supplier: { name: "ASL Supplier 2" },
            order_date: "2020-01-13",
            // similarity: Math.round(80 + (Math.random() * 15)),
            similarity: 87,
            cost: 15622 * 100,
            cost_currency: "USD",
          },
        ];
      }
      if (this.row.itemType == "product") {
        if (!this.row.suggestedProducts) {
          return [];
        }
        let orderedByCost = _.orderBy(this.row.suggestedProducts, "cost");
        return _.map(orderedByCost, (product, i) => {
          let p = {
            product_name: product.name,
            quantity: this.row.quantity,
            supplier: { name: suppliers.formatSupplierName(product.supplier_name) },
            // similarity: Math.round(80 + (Math.random() * 15)),
            similarity: i === 0 ? 93 : Math.round(70 + Math.random() * 15),
            cost: product.cost * this.row.quantity,
            cost_currency: product.cost_currency,
          };
          if (product.order_date) {
            p.order_date = product.order_date;
          }
          return p;
        });
      }
      return [];
    },
  },
};
</script>

<style lang="scss">
.similar-products-row {
  th {
    padding-top: 5px !important;
  }
}
</style>
