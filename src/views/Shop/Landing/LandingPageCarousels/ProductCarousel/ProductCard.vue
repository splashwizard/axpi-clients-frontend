<template>
  <div class="suggested-product-card-wrapper">
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <div v-else class="suggested-product-card" @click.prevent="navigateToProduct(productFleshed['product'])">
      <div class="top" :style="{ backgroundImage: 'url(' + getImageSrc(productFleshed['product']) + ')' }"></div>
      <div class="bottom">
        <div class="left">
          <div class="title">
            {{ truncate(productFleshed["product"].name, 50) }}
          </div>
          <div class="category">
            {{ getCategory(productFleshed["product"]) }}
          </div>
        </div>
        <div class="right">
          <a-spin size="small" v-if="isLoadingPrices"></a-spin>
          <span v-else>{{ priceRange }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "../../../../../mixins/Orders";

const _ = require("lodash");

export default {
  name: "ProductCard",
  props: ["product"],
  mixins: [Orders],
  data() {
    return {
      productFleshed: null,
      isLoading: true,
      prices: [],
      isLoadingPrices: true,
    };
  },
  created() {
    this.loadProductDetails();
    this.loadPrices();
  },
  computed: {
    priceRange() {
      let prices = this.prices;
      if (prices && prices.length) {
        let ordered = _.orderBy(prices, "price");
        let minPrice = _.first(ordered);
        let maxPrice = _.last(ordered);

        if (minPrice !== maxPrice) {
          let minPriceFormatted = this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });

          let maxPriceFormatted = this.formatCostInPence2dp({
            cost: maxPrice.price,
            cost_currency: "USD",
          });

          return minPriceFormatted + " - " + maxPriceFormatted;
        } else {
          return this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: "USD",
          });
        }
      }
      return "-";
    },
  },
  methods: {
    loadProductDetails() {
      let vm = this;
      vm.isLoading = true;
      axios
        .get(window.API_BASE + "/products/" + this.product.product_id)
        .then((r) => {
          vm.isLoading = false;
          vm.productFleshed = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoading = false;
          vm.$message.error("Error loading product details");
        });
    },

    loadPrices() {
      let vm = this;
      vm.isLoadingPrices = true;
      axios
        .get(window.API_BASE + "/products/" + this.product.product_id + "/prices")
        .then((r) => {
          vm.isLoadingPrices = false;
          vm.prices = r.data;
        })
        .catch((e) => {
          console.log(e);
          vm.isLoadingPrices = false;
          vm.$message.error("Error loading product prices");
        });
    },

    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    truncate(str, maxLength) {
      if (str && str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    },

    getCategory(product) {
      if (product.taxonomyCategory) {
        return product.taxonomyCategory[product.taxonomyCategory.length - 1];
      }
      return "Miscellaneous";
    },

    navigateToProduct(product) {
      let id = product.id;
      if (!id) {
        id = product["_id"];
      }
      this.$router.push("/products/" + id);
    },
  },
};
</script>

<style scoped lang="scss">
.suggested-product-card-wrapper {
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;

  .suggested-product-card {
    .top {
      width: 100%;
      height: 300px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .bottom {
      display: flex;

      .left {
        flex-grow: 1;

        .title {
          font-weight: 600;
          color: #111;
        }

        .category {
          font-size: 15px;
          color: #757575;
        }
      }

      .right {
        flex-shrink: 1;
        min-width: 150px;
        text-align: right;
        padding-right: 15px;
      }
    }
  }
}
</style>
