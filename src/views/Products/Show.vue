<template>
  <div class="product-show">
    <loading-screen :is-loading="isLoading||isLoadingDocuments||isLoadingDetails"></loading-screen>

    <a-page-header v-if="product" :title="product.name" @back="backToAllProducts"></a-page-header>

    <!-- Images & Description -->
    <div v-if="product" class="product-show-section">
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

    <!-- Tabs -->
    <div class="tabs-wrapper">
      <a-tabs v-if="product">
        <a-tab-pane key="specification" tab="Specification">
          <div class="specifications-tab-wrapper">
            <specifications-tab></specifications-tab>
          </div>
        </a-tab-pane>
        <a-tab-pane key="documents" tab="Documents">
          <documents-tab></documents-tab>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- / Tabs -->
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ImageCarousel from "./Show/ImageCarousel";
import DocumentsTab from "./Show/DocumentsTab";
import SpecificationsTab from "./Show/SpecificationsTab";

export default {
  name: "Show",
  components: {DocumentsTab, SpecificationsTab, ImageCarousel},
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
      isLoading: 'isLoading',
      isLoadingDocuments: 'isLoadingDocuments',
      isLoadingDetails: 'isLoadingDetails'
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
.product-show {
  padding: 7px 30px;
}

.product-show-section {
  margin-top: 40px;
}

.tabs-wrapper {
  margin-top: 90px;
}

.specifications-tab-wrapper {
  margin-top: 15px;
  margin-bottom: 20px;
}
</style>