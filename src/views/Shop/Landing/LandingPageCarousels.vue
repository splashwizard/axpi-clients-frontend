<template>
  <div class="carousels-wrapper">
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <div v-if="!isLoading">
      <product-carousel v-for="(carousel, i) in carousels" :carousel="carousel" :key="i"></product-carousel>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProductCarousel from "./LandingPageCarousels/ProductCarousel";

export default {
  name: "LandingPageCarousels",
  components: { ProductCarousel },
  data() {
    return {
      isLoading: false,
      carousels: [],
    };
  },
  created() {
    this.loadCarousels();
  },
  methods: {
    loadCarousels() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/shop-landing-page/carousels")
        .then((r) => {
          vm.isLoading = false;
          vm.carousels = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading carousels");
        });
    },
  },
};
</script>

<style scoped>
.carousels-wrapper {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
