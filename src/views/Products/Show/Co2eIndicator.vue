<template>
  <div class="co2e-indicator">
    <a-spin size="small" v-if="isLoading"></a-spin>
    <img v-if="!isLoading && co2e" src="/img/leaf.jpg" class="leaf" width="15" alt="Leaf" />
    <span v-if="!isLoading && co2e">{{ formatCo2e(co2e) }}kg CO2e</span>
  </div>
</template>

<script>
import axios from "axios";
import eventBus from "../../../event-bus";
export default {
  name: "Co2eIndicator",
  props: ["product"],
  data() {
    return {
      isLoading: true,
      co2e: 0,
    };
  },
  created() {
    this.getCo2e();
    let vm = this;
    eventBus.$on("product-materials-updated", function () {
      vm.getCo2e();
    });
  },
  computed: {
    productId() {
      let id = this.product.id;
      if (!id) {
        id = this.product["_id"];
      }
      return id;
    },
  },
  watch: {
    product() {
      this.getCo2e();
    },
  },
  methods: {
    getCo2e() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/products/" + this.productId + "/esg/co2e")
        .then((r) => {
          vm.co2e = r.data;
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.co2e = null;
        });
    },

    formatCo2e(val) {
      return Math.round(val * 100) / 100;
    },
  },
};
</script>

<style scoped lang="scss">
.co2e-indicator {
  align-items: center;
  display: flex;
  flex-shrink: 1;

  min-width: 130px;
  text-align: right;
  justify-content: flex-end;

  .leaf {
    margin-right: 6px;
  }
}
</style>
