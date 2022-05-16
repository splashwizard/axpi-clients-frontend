<template>
  <div class="suggested-product-card-wrapper">
    <div class="suggested-product-card" @click.prevent="navigateToProduct(product)">
      <!--      <a-avatar v-if="product.comparison && product.comparison === 'cheaper'"-->
      <!--          icon="dollar" class="comparison-icon" style="background-color:#87d068" />-->

      <div class="top" :style="{ backgroundImage: 'url(' + getImageSrc(product) + ')' }"></div>
      <div class="bottom">
        <div class="left">
          <div class="title">
            {{ truncate(product.name, 50) }}
          </div>
          <div class="category">
            {{ getCategory(product) }}
            <!--            <a-tag color="blue"-->
            <!--                   v-if="product.comparison && product.comparison == 'cheaper'">Cost Effective-->
            <!--            </a-tag>-->

            <!--            <img src="/img/leaf.jpg" v-if="product.comparison && product.comparison == 'more-environmentally-friendly'" class="leaf" width="15" style="margin-left: 5px;" alt="Leaf">-->
          </div>
        </div>
        <div class="right">
          <a-spin size="small" v-if="isLoadingPrices"></a-spin>
          <div v-else>{{ priceRange }}</div>
          <a-tag color="blue" style="margin-right: 0 !important; display: inline-block" v-if="suggestion.cheaper"
            >Cost Effective
          </a-tag>
          <a-tag color="blue" style="margin-right: 0 !important; display: inline-block" v-if="suggestion.more_effective"
            >More Effective
          </a-tag>
          <a-tag color="blue" style="margin-right: 0 !important; display: inline-block" v-if="suggestion.in_stock"
            >In Stock
          </a-tag>
          <a-tag
            v-if="suggestion.more_environmentally_friendly"
            color="green"
            style="margin-right: 0 !important; display: inline-block"
          >
            Environmentally Friendly
          </a-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const _ = require("lodash");
import Orders from "../../../mixins/Orders";

export default {
  name: "SuggestedProductCard",
  props: ["suggestion"],
  mixins: [Orders],
  data() {
    return {
      prices: [],
      isLoadingPrices: true,
    };
  },
  computed: {
    product() {
      return this.suggestion.product;
    },

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
  created() {
    this.loadPrices();
  },
  methods: {
    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
    },

    loadPrices() {
      let vm = this;
      vm.isLoadingPrices = true;
      axios
        .get(window.API_BASE + "/products/" + this.product["_id"] + "/prices")
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

<style lang="scss" scoped>
.suggested-product-card-wrapper {
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;

  .suggested-product-card {
    position: relative;

    .comparison-icon {
      position: absolute;
      right: 30px;
      top: 20px;
    }

    .top {
      width: 100%;
      height: 300px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .bottom {
      display: flex;
      padding-top: 15px;

      .left {
        flex-grow: 1;

        .title {
          font-weight: 600;
          color: #111;
        }

        .category {
          font-size: 15px;
          color: #757575;
          margin-bottom: 4px;
        }
      }

      .right {
        flex-shrink: 1;
        //min-width: 60px;
        min-width: 150px;
        text-align: right;
        padding-right: 15px;
      }
    }
  }
}
</style>
