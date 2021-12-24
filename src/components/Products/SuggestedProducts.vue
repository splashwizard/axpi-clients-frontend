<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading">
      <a-spin></a-spin>
    </div>
    <!-- / Loading -->

    <!-- Loaded -->
    <div v-if="!isLoading">
      <a-alert message="No suggested products to show" v-if="suggestedProducts.length === 0" banner/>

      <carousel :per-page="4">
        <slide v-for="(suggestedProduct, i) in suggestedProducts" :key="i">
          <suggested-product-card :product="suggestedProduct"></suggested-product-card>
        </slide>
      </carousel>
    </div>
    <!-- / Loaded -->
  </div>
</template>

<script>
import SuggestedProductCard from "./SuggestedProducts/SuggestedProductCard";
import axios from 'axios';

export default {
  name: "SuggestedProducts",
  props: ['product'],
  components: {SuggestedProductCard},
  data() {
    return {
      isLoading: false,
      suggestedProducts: []
    }
  },
  watch: {
    product() {
      this.loadSuggestedProducts();
    }
  },
  created() {
    this.loadSuggestedProducts();
  },
  methods: {
    loadSuggestedProducts() {
      let vm = this;

      let id = this.product.id;
      if (!id) {
        id = this.product['_id'];
      }

      vm.isLoading = true;
      axios.get(window.API_BASE + '/products/' + id + '/suggestions').then(r => {
        vm.suggestedProducts = r.data;
        vm.isLoading = false;
      }).catch(e => {
        console.log(e);
        vm.isLoading = false;
        vm.$message.error('Error loading suggested products');
      });
    }
  }
}
</script>

<style scoped>

</style>