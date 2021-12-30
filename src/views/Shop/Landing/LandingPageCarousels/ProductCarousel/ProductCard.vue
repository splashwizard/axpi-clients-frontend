<template>
  <div class="suggested-product-card-wrapper">
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <div v-else
        class="suggested-product-card" @click.prevent="navigateToProduct(productFleshed['product'])">
      <div class="top" :style="{backgroundImage: 'url(' + getImageSrc(productFleshed['product']) + ')'}">
      </div>
      <div class="bottom">
        <div class="left">
          <div class="title">
            {{ truncate(productFleshed['product'].name, 50) }}
          </div>
          <div class="category">
            {{ getCategory(productFleshed['product']) }}
          </div>
        </div>
        <div class="right">
          £109
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "ProductCard",
  props: ['product'],
  data() {
    return {
      productFleshed: null,
      isLoading: true
    }
  },
  created() {
    this.loadProductDetails();
  },
  methods: {
    loadProductDetails() {
      let vm = this;
      vm.isLoading = true;
      axios.get(window.API_BASE + '/products/' + this.product.product_id).then(r => {
        vm.isLoading = false;
        vm.productFleshed = r.data;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading product details');
      });
    },

    getImageSrc(product) {
      if (product["imageURLs"] && product["imageURLs"].length) {
        return product["imageURLs"][0];
      }
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
        min-width: 60px;
        text-align: right;
        padding-right: 15px;
      }
    }

  }
}
</style>