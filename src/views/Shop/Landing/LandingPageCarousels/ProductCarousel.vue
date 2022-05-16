<template>
  <div>
    <div class="title">
      <div class="left">
        <h2>{{ carousel.name }}</h2>
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

    <div>
      <a-alert message="No products to show" v-if="products.length === 0" banner />

      <div class="carousel-container" ref="carousel">
        <div class="carousel-card" v-for="(product, i) in products" :key="i">
          <product-card :product="product"></product-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "./ProductCarousel/ProductCard";
export default {
  name: "ProductCarousel",
  components: { ProductCard },
  props: ["carousel"],
  methods: {
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
  computed: {
    products() {
      return this.carousel.shop_landing_carousel_products;
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
    h2 {
      font-size: 25px;
    }
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
