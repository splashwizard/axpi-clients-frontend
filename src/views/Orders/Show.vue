<template>
  <div class="home">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-page-header v-if="order" :title="order.product_name" @back="backToAllOrders" />

    <div class="page-body" v-if="order">
      <order-description :order="order"></order-description>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OrderDescription from "../../components/Orders/Show/OrderDescription";

let _ = require("lodash");

export default {
  name: "Show",
  components: { OrderDescription },
  data() {
    return {
      order: null,
      isLoading: false,
      serverErrors: [],
    };
  },
  created() {
    this.loadOrder(this.$route.params.id);
  },
  methods: {
    backToAllOrders() {
      this.$router.push("/orders");
    },

    loadOrder(id) {
      let vm = this;
      vm.order = null;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/orders/" + id)
        .then((r) => {
          vm.isLoading = false;
          vm.order = r.data;
        })
        .catch((e) => {
          vm.isLoading = false;
          vm.$message.error("Error loading order");
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
