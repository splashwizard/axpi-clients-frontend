<template>
  <div class="home">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-page-header v-if="supplier" :title="supplier.name" @back="backToAllSuppliers" />

    <div class="page-body" v-if="supplier">
      <supplier-factory-details
        v-for="(factory, i) in supplier.factories"
        :factory="factory"
        :key="i"
      ></supplier-factory-details>

      <!--      <order-description :order="order"></order-description>-->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SupplierFactoryDetails from "../../components/Suppliers/SupplierFactoryDetails";
// import OrderDescription from "../../components/Orders/Show/OrderDescription";

let _ = require("lodash");

export default {
  name: "Show",
  components: { SupplierFactoryDetails },
  data() {
    return {
      supplier: null,
      isLoading: false,
      serverErrors: [],
    };
  },
  created() {
    this.loadSupplier(this.$route.params.id);
  },
  methods: {
    backToAllSuppliers() {
      this.$router.push("/suppliers");
    },

    loadSupplier(id) {
      let vm = this;
      vm.order = null;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/suppliers/" + id)
        .then((r) => {
          vm.isLoading = false;
          vm.supplier = r.data;
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading supplier");
          console.log(e);

          let errors;
          if (e.response && e.response.data && typeof e.response.data === "object") {
            errors = _.flatten(_.toArray(e.response.data.errors));
          } else {
            errors = ["Something went wrong. Please try again."];
          }
          vm.serverErrors = errors;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.page-body {
  margin-top: 25px;
  padding-bottom: 10px;
}
</style>
