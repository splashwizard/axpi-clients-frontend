<template>
  <a-table class="similar-products-row"
           slot="expandedRowRender"
           :columns="columns"
           :data-source="similarProducts"
           :pagination="false">
    <div slot="productName" slot-scope="productName">
      {{ productName }} <a-tag style="margin-left: 5px;" color="blue">Past Order</a-tag>
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
  </a-table>
</template>

<script>
import Dates from "../../../../mixins/Dates";
import Orders from "../../../../mixins/Orders";

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
      return [
        {
          ...this.row.order,
          similarity: 100
        }
      ]
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