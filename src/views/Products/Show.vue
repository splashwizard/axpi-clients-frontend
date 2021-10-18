<template>
  <div class="product-show">
    <loading-screen :is-loading="isLoading"></loading-screen>

    <a-page-header v-if="product" :title="product.name" @back="backToAllProducts"></a-page-header>

    <!-- Images & Description -->
    <div class="product-show-section">
      <a-row :gutter="10">
        <a-col :span="12">
          <image-carousel :urls="product['imageURLs']"></image-carousel>
        </a-col>
        <a-col :span="11">
          {{ product['description'] }}
        </a-col>
      </a-row>
    </div>
    <!-- / Images & Description -->

  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ImageCarousel from "./Show/ImageCarousel";

export default {
  name: "Show",
  components: {ImageCarousel},
  data() {
    return {}
  },
  created() {
    this.attemptLoadProduct();
  },
  watch: {
    '$route'() {
      this.attemptLoadProduct();
    }
  },
  computed: {
    ...mapGetters('productViewer', {
      product: 'product',
      isLoading: 'isLoading'
    })
  },
  methods: {
    ...mapActions('productViewer', {
      loadProduct: 'loadProduct'
    }),

    backToAllProducts() {
      this.$router.push('/products');
    },

    attemptLoadProduct() {
      this.loadProduct(this.$route.params.id);
    }
  }
}
</script>

<style scoped>
.product-show-section {
  margin-top: 40px;
}
</style>