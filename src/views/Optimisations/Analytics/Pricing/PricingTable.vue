<template>
  <div class="pricing-table">
    <a-table :columns="columns" :data-source="data" class="axpi-table">
      <div slot="expectedPrice" slot-scope="expectedPrice">
        {{ formatCost({ cost: expectedPrice, cost_currency: "USD" }) }}
      </div>
      <div slot="co2e" slot-scope="co2e">{{ co2e }} kg</div>
    </a-table>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../mixins/Orders";

const columns = [
  {
    dataIndex: "supplier",
    title: "Supplier",
    key: "supplier",
  },
  {
    dataIndex: "specification",
    title: "Specification",
    key: "specification",
  },
  {
    dataIndex: "expected_price",
    title: "Expected Price",
    key: "expected_price",
    scopedSlots: { customRender: "expectedPrice" },
  },
  {
    dataIndex: "co2e",
    title: "CO2e",
    key: "co2e",
    scopedSlots: { customRender: "co2e" },
  },
];

export default {
  name: "PricingTable",
  props: ["optimisationId"],
  mixins: [Orders],
  data() {
    return {
      isLoading: false,
      data: [],
      columns,
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      let vm = this;
      vm.data = null;
      vm.isLoading = true;
      axios
        .post(window.API_BASE + "/optimisations/" + this.optimisationId + "/supplier-spec-expected-prices")
        .then((r) => {
          vm.isLoading = false;
          vm.data = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.data = [];
          vm.$message.error("Error loading supplier spec expected prices");
        });
    },
  },
};
</script>

<style scoped>
/*.pricing-table {*/
/*  margin-top: 10px;*/
/*}*/
</style>
