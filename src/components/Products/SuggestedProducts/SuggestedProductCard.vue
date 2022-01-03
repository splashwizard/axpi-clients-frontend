<template>
  <div class="suggested-product-card-wrapper">
    <div class="suggested-product-card" @click.prevent="navigateToProduct(product)">
      <div class="top" :style="{backgroundImage: 'url(' + getImageSrc(product) + ')'}">
      </div>
      <div class="bottom">
        <div class="left">
          <div class="title">
            {{ truncate(product.name, 50) }}
          </div>
          <div class="category">
            {{ getCategory(product) }}
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
const _ = require('lodash');
import Orders from "../../../mixins/Orders";

export default {
  name: "SuggestedProductCard",
  props: ['product'],
  mixins: [Orders],
  data() {
    return {
      prices: [],
      isLoadingPrices: true
    }
  },
  computed: {
    priceRange() {
      let prices = this.prices;
      if (prices && prices.length) {
        let ordered = _.orderBy(prices, 'price');
        let minPrice = _.first(ordered);
        let maxPrice = _.last(ordered);

        if (minPrice !== maxPrice) {
          let minPriceFormatted = this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: 'USD'
          });

          let maxPriceFormatted = this.formatCostInPence2dp({
            cost: maxPrice.price,
            cost_currency: 'USD'
          });

          return minPriceFormatted + ' - ' + maxPriceFormatted;
        } else {
          return this.formatCostInPence2dp({
            cost: minPrice.price,
            cost_currency: 'USD'
          });
        }
      }
      return '-';
    }
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
      axios.get(window.API_BASE + '/products/' + this.product['_id'] + '/prices').then(r => {
        vm.isLoadingPrices = false;
        vm.prices = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoadingPrices = false;
        vm.$message.error('Error loading product prices');
      });
    },

    truncate(str, maxLength) {
      if (str && str.length > maxLength) {
        return str.slice(0, maxLength) + '...';
      }
      return str;
    },

    getCategory(product) {
      if (product.taxonomyCategory) {
        return product.taxonomyCategory[product.taxonomyCategory.length - 1];
      }
      return 'Miscellaneous';
    },

    navigateToProduct(product) {
      let id = product.id;
      if (!id) {
        id = product['_id'];
      }
      this.$router.push('/products/' + id);
    }
  }
}
</script>

<style lang="scss" scoped>
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
        //min-width: 60px;
        min-width: 150px;
        text-align: right;
        padding-right: 15px;
      }
    }

  }
}
</style>