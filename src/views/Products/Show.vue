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
          <!-- More details -->
          <div class="more-details" v-if="productVendorMapping && productVendorMapping.vendors">
            <h3>Vendors:</h3>
            <a-badge v-for="(vendor, i) in productVendorMapping.vendors.names" :key="i"
                     :count="vendor"/>
          </div>
          <!-- / More details -->

          <!-- Manufacturer -->
          <div class="more-details" v-if="product && product['manufacturer']">
            <h3>Manufacturer:</h3>
            {{ product['manufacturer'] }}
          </div>
          <!-- / Manufacturer -->

          <h3>Description:</h3>
          <div v-if="descriptionTooLong">
            {{ descriptionToShow }}
            <div style="margin-top: 10px;">
              <a v-if="descriptionShowMore"
                 href="#" style="margin-top: 5px;" @click.prevent="toggleDescriptionShowMore">View less
                <a-icon :style="{fontSize: '10px'}" type="up"/>
              </a>
              <a v-if="!descriptionShowMore"
                 href="#" style="margin-top: 5px;" @click.prevent="toggleDescriptionShowMore">View more
                <a-icon :style="{fontSize: '10px'}" type="down"/>
              </a>
            </div>
          </div>
          <div v-if="!descriptionTooLong">
            {{ product['description'] }}
          </div>
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
    return {
      descriptionShowMore: false
    }
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
      productVendorMapping: 'productVendorMapping',
      isLoading: 'isLoading',
      isLoadingDocuments: 'isLoadingDocuments',
      isLoadingDetails: 'isLoadingDetails'
    }),

    descriptionTooLong() {
      let length = this.product['description'].length;
      if (length > 1000) {
        return true;
      }
      return false;
    },

    descriptionToShow() {
      if (this.descriptionShowMore) {
        return this.product['description'];
      }
      return this.product['description'].substring(0, 1000);
    }
  },
  methods: {
    ...mapActions('productViewer', {
      loadProduct: 'loadProduct'
    }),

    toggleDescriptionShowMore() {
      this.descriptionShowMore = !this.descriptionShowMore;
    },

    backToAllProducts() {
      this.$router.push('/products');
    },

    attemptLoadProduct() {
      this.loadProduct(this.$route.params.id);
    }
  }
}
</script>

<style scoped lang="scss">
.product-show {
  padding: 7px 30px;
}

.product-show-section {
  margin-top: 40px;
}

.tabs-wrapper {
  margin-top: 90px;
  margin-bottom: 80px;
}

.specifications-tab-wrapper {
  margin-top: 15px;
}

.more-details {
  margin-bottom: 20px;

  .ant-badge {
    margin-right: 5px;
  }
}
</style>