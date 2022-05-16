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

    <a-descriptions :column="1" title="Emissions" bordered>
      <a-descriptions-item label="CO2">
        <a-spin v-if="isLoadingEmissions" />
        <span v-if="!isLoadingEmissions">{{ emissions ? formatFloat(emissions["total"]) : "-" }} kg</span>
        <emission-breakdown-modal-and-button
          :is-loading="isLoadingEmissions"
          :emissions="emissions"
        ></emission-breakdown-modal-and-button>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import orders from "../../../helpers/orders";
import Dates from "../../../mixins/Dates";
import Orders from "../../../mixins/Orders";
import EmissionBreakdownModalAndButton from "./EmissionBreakdownModalAndButton";
import axios from "axios";

export default {
  name: "OrderDescription",
  props: ["order"],
  mixins: [Dates, Orders],
  data() {
    return {
      isLoadingEmissions: false,
      emissions: null,
    };
  },
  components: { EmissionBreakdownModalAndButton },
  created() {
    this.loadEmissions();
  },
  methods: {
    loadEmissions() {
      let vm = this;
      vm.isLoadingEmissions = true;
      axios
        .get(window.API_BASE + "/orders/" + vm.order.id + "/environmental-data")
        .then((r) => {
          vm.isLoadingEmissions = false;
          vm.emissions = r.data;
        })
        .catch((e) => {
          vm.isLoadingEmissions = false;
          console.log(e);
        });
    },

    formatFloat(val) {
      return Math.round(val * 100 + Number.EPSILON) / 100;
    },
  },
  computed: {
    orderLocal() {
      return orders.decodeOrder(this.order);
    },
  },
};
</script>

<style scoped>
.ant-descriptions {
  margin-bottom: 40px;
}
</style>
