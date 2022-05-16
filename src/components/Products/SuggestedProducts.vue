<template>
  <div>
    <div class="title">
      <div class="left">
        <h2>Recommended Products</h2>
      </div>
      <div class="right">
        <a-button
          @click.prevent="scrollLeft"
          type="default"
          shape="circle"
          icon="left"
          size="large"
          class="left-button"
        />
        <a-button @click.prevent="scrollRight" type="default" shape="circle" icon="right" size="large" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading">
      <a-alert message="No suggested products to show" v-if="suggestedProducts.length === 0" banner />

      <div class="carousel-container" ref="carousel">
        <div class="carousel-card" v-for="(suggestedProduct, i) in suggestedProducts" :key="i">
          <suggested-product-card :suggestion="suggestedProduct"></suggested-product-card>
        </div>
      </div>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import SuggestedProductCard from "./SuggestedProducts/SuggestedProductCard";
import axios from "axios";

export default {
  name: "SuggestedProducts",
  props: ["product"],
  components: { SuggestedProductCard },
  data() {
    return {
      isLoading: false,
      suggestedProducts: [],
    };
  },
  watch: {
    product() {
      this.loadSuggestedProducts();
    },
  },
  created() {
    this.loadSuggestedProducts();
  },
  methods: {
    loadSuggestedProducts() {
      let vm = this;

      let id = this.product.id;
      if (!id) {
        id = this.product["_id"];
      }

      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/products/" + id + "/suggestions")
        .then((r) => {
          vm.suggestedProducts = r.data;
          vm.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading suggested products");
        });
    },

    scrollLeft() {
      let scrollStep = 400;
      let carousel = this.$refs["carousel"];

      let sl = carousel.scrollLeft;

      if (sl - scrollStep <= 0) {
        carousel.scrollTo({
          left: 0,
          top: 0,
          behaviour: "smooth",
        });
      } else {
        carousel.scrollTo({
          left: sl - scrollStep,
          top: 0,
          behaviour: "smooth",
        });
      }
    },

    scrollRight() {
      let scrollStep = 400;
      let carousel = this.$refs["carousel"];

      let sl = carousel.scrollLeft,
        cw = carousel.scrollWidth;

      if (sl + scrollStep >= cw) {
        carousel.scrollTo({
          left: cw,
          top: 0,
          behaviour: "smooth",
        });
      } else {
        carousel.scrollTo({
          left: sl + scrollStep,
          top: 0,
          behaviour: "smooth",
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 20px;
  display: flex;

  .left {
    flex-grow: 1;
  }

  .right {
    padding-left: 15px;
    flex-shrink: 1;

    .left-button {
      margin-right: 10px;
    }
  }
}

.carousel-container {
  overflow-x: scroll;
  white-space: nowrap;
  padding-bottom: 50px;

  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;

  .carousel-card {
    scroll-snap-align: start;

    white-space: normal;
    max-width: 400px;
    width: 400px;
    min-width: 400px;
    display: inline-block;
  }
}
</style>
