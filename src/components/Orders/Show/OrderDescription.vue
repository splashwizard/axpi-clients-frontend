<template>
  <div>
    <a-descriptions :column="2" title="General Information - Product Information" bordered>
      <a-descriptions-item label="Product Name">
        {{ orderLocal.product_name }}
      </a-descriptions-item>
      <a-descriptions-item label="Product Description">
        {{ orderLocal.product_description }}
      </a-descriptions-item>
      <a-descriptions-item label="Reference Number">
        {{ orderLocal.reference_number }}
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions :column="2" title="General Information - Order Information" bordered>
      <a-descriptions-item v-if="orderLocal.supplier" label="Supplier">
        {{ orderLocal.supplier.name }}
      </a-descriptions-item>
      <a-descriptions-item label="Quantity">
        {{ orderLocal.quantity }}
      </a-descriptions-item>
      <a-descriptions-item label="Order Date">
        {{ formatDate(orderLocal.order_date) }}
      </a-descriptions-item>
      <a-descriptions-item label="Date Delivered">
        {{ formatDate(orderLocal.date_delivered) }}
      </a-descriptions-item>
      <a-descriptions-item label="Price">
        {{ formatCost(orderLocal) }}
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions :column="2" title="Specification Information" bordered>
      <a-descriptions-item label="Type">
        {{ formatType(orderLocal.product_type) }}
      </a-descriptions-item>
      <a-descriptions-item label="Subtype">
        {{ formatSubtype(orderLocal.product_subtype) }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import orders from "../../../helpers/orders";
import Dates from "../../../mixins/Dates";
import Orders from "../../../mixins/Orders";

export default {
  name: "OrderDescription",
  props: ['order'],
  mixins: [Dates, Orders],
  computed: {
    orderLocal() {
      return orders.decodeOrder(this.order);
    }
  }
}
</script>

<style scoped>
.ant-descriptions {
  margin-bottom: 40px;
}
</style>