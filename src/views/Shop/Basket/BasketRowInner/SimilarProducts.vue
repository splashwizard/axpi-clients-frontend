<template>
  <a-table class="similar-products-row"
           slot="expandedRowRender"
           :columns="columns"
           :loading="row.isLoadingSuggestedProducts"
           :data-source="similarProducts"
           :pagination="false">
    <div slot="productName" slot-scope="productName">
      {{ productName }}
      <a-tag style="margin-left: 5px;" color="blue">Past Order</a-tag>
    </div>
    <div slot="orderDate" slot-scope="orderDate">
      {{ orderDate ? formatDate(orderDate) : '-' }}
    </div>
    <div slot="cost" slot-scope="cost, order">
      {{ formatCostInPence(order) }}
    </div>
    <div slot="similarity" slot-scope="similarity">
      <a-progress type="circle"
                  :width="38"
                  style="float: right;"
                  :percent="similarity"/>
    </div>
    <div slot="compare">
      <a-button icon="eye" style="float: right;">Compare</a-button>
    </div>
  </a-table>
</template>

<script>
import Dates from "../../../../mixins/Dates";
import Orders from "../../../../mixins/Orders";
const _ = require('lodash');

const columns = [
  {
    title: 'Name',
    dataIndex: 'product_name',
    scopedSlots: {customRender: 'productName'}
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity'
  },
  {
    title: 'Supplier',
    dataIndex: 'supplier.name'
  },
  {
    title: 'Order Date',
    dataIndex: 'order_date',
    scopedSlots: {customRender: 'orderDate'}
  },
  {
    title: 'Cost',
    dataIndex: 'cost',
    scopedSlots: {customRender: 'cost'}
  },
  {
    title: '',
    dataIndex: 'similarity',
    scopedSlots: {customRender: 'similarity'}
  },
  {
    title: '',
    scopedSlots: {customRender: 'compare'}
  }
];
export default {
  name: "SimilarProducts",
  props: ['row'],
  mixins: [Dates, Orders],
  data() {
    return {
      columns
    }
  },
  computed: {
    similarProducts() {
      if (this.row.itemType == 'order') {
        return [
          {
            ...this.row.order,
            similarity: 100
          },
          {
            product_name: 'AGL - Insert Q3 Bills',
            quantity: 1215983,
            supplier: {name: 'ASL Supplier 2'},
            order_date: '2020-01-13',
            similarity: 60 + (Math.random() * 40),
            cost: 56500,
            cost_currency: 'USD'
          }
        ]
      }
      if (this.row.itemType == 'product') {
        if (!this.row.suggestedProducts) {
          return [];
        }
        return _.map(this.row.suggestedProducts, product => {
          return {
            product_name: product.name,
            quantity: 5,
            supplier: {name: 'TODO'},
            order_date: '2020-01-13',
            similarity: 93,
            cost: 56500,
            cost_currency: 'USD'
          }
        });
      }
      return [];
    }
  }
}
</script>

<style lang="scss">
.similar-products-row {
  th {
    padding-top: 5px !important;
  }
}
</style>