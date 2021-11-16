<template>
  <div class="product-show">
    <loading-screen :is-loading="isLoading||isLoadingDocuments||isLoadingDetails||isSavingDescription"></loading-screen>

    <a-page-header v-if="product && fromShop" :title="product.name"
                   @back="backToShop"
    >
      <template slot="extra">
        <view-toggler></view-toggler>
      </template>
    </a-page-header>
    <a-page-header v-if="product && !fromShop" :title="product.name">
      <template slot="extra">
        <view-toggler></view-toggler>
      </template>
    </a-page-header>

    <!-- Product details top -->
    <div class="product-details-top">
      <!-- Has vendor mapping -->
      <div v-if="productVendorMapping && productVendorMapping.vendors && productVendorMapping.vendors.names"
           class="product-details-top-property">
        <b>Vendors:</b>
        <a-badge v-for="(vendor, i) in productVendorMapping.vendors.names" :key="i"
                 :count="vendor"/>
      </div>
      <!-- / Has vendor mapping -->

      <!-- Doesn't have vendor mapping -->
      <div v-if="!(productVendorMapping && productVendorMapping.vendors)" class="product-details-top-property">
        <b>Vendors:</b>
        <a-badge :count="product['vendor']"/>
      </div>
      <!-- Doesn't have vendor mapping -->

      <!-- Manufacturer -->
      <div class="product-details-top-property">
        <b>Manufacturer:</b>
        {{ product['manufacturer'] ? product['manufacturer'] : '-' }}
      </div>
      <!-- / Manufacturer -->

      <!-- Product Code -->
      <div class="product-details-top-property">
        <b>Product Code:</b>
        {{ product['productCode'] ? product['productCode'] : '-' }}
      </div>
      <!-- / Product Code -->
    </div>
    <!-- / Product details top -->

    <!-- Images & Description -->
    <div v-if="product" class="product-show-section">
      <a-row :gutter="10">
        <a-col :span="12">
          <image-carousel :urls="product['imageURLs']"></image-carousel>
        </a-col>
        <a-col :span="11">
          <div style="margin-bottom: 10px;">
            <h3 style="display: inline;">Description</h3>
            <a-button style="display: inline; margin-left: 10px;"
                      @click.prevent="editDescription" v-if="view == 'edit' && !isEditingDescription" size="small"
                      icon="edit" type="default"></a-button>
          </div>

          <!-- Not Editing -->
          <div v-if="view !== 'edit'">
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
              {{ description }}
            </div>
          </div>
          <!-- / Not Editing -->

          <!-- Editing -->
          <div v-if="view === 'edit'">
            <div v-if="isEditingDescription">
              <a-textarea
                  v-model="descriptionLocalEditing"
                  placeholder="Description..."
                  :auto-size="{ minRows: 10 }"
              />

              <!-- Actions -->
              <div style="margin-top: 10px;">
                <a-button @click.prevent="cancelEditDescription" style="margin-right: 5px;" v-if="isEditingDescription"
                          type="default">Cancel
                </a-button>
                <a-button @click.prevent="saveDescription" v-if="isEditingDescription" type="primary">Save</a-button>
              </div>
              <!-- / Actions -->
            </div>
            <div v-else>
              {{ description }}
            </div>
          </div>
          <!-- / Editing -->

          <!-- Quantity: Not Editing -->
          <div v-if="view !== 'edit'"
               class="quantity-changer-wrapper">
            <a-button v-if="!isProductInBasket(product)"
                      type="primary" @click.prevent="() => addProductToBasket(product)">Add to basket
            </a-button>

            <div v-else class="quantity-changer">
              <a-button @click.prevent="() => decrementProductQuantity(product)"
                        icon="minus">
              </a-button>
              <div>
                <a-input type="number"
                         @change="e => setProductQuantity({quantity: e.target.value, id: product['_id']})"
                         :value="getQuantityOfProductInBasket(product)"></a-input>
              </div>
              <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->
              <a-button @click.prevent="() => incrementProductQuantity(product)"
                        icon="plus"></a-button>
            </div>
          </div>
          <!-- / Quantity: Not Editing -->

        </a-col>
      </a-row>
    </div>
    <!-- / Images & Description -->

    <!-- Properties -->
    <div class="page-inner-wrapper">
      <div class="page-section">
        <h2>Specification</h2>
        <specifications-tab></specifications-tab>
      </div>

      <div class="page-section">
        <h2>Documents</h2>
        <documents-tab></documents-tab>
      </div>
    </div>
    <!-- / Properties -->

    <!--    &lt;!&ndash; Tabs &ndash;&gt;-->
    <!--    <div class="tabs-wrapper">-->
    <!--      <a-tabs v-if="product">-->
    <!--        <a-tab-pane key="specification" tab="Specification">-->
    <!--          <div class="specifications-tab-wrapper">-->
    <!--            <specifications-tab></specifications-tab>-->
    <!--          </div>-->
    <!--        </a-tab-pane>-->
    <!--        <a-tab-pane key="documents" tab="Documents">-->
    <!--          <documents-tab></documents-tab>-->
    <!--        </a-tab-pane>-->
    <!--      </a-tabs>-->
    <!--    </div>-->
    <!--    &lt;!&ndash; / Tabs &ndash;&gt;-->
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ImageCarousel from "./Show/ImageCarousel";
import DocumentsTab from "./Show/DocumentsTab";
import SpecificationsTab from "./Show/SpecificationsTab";
import ViewToggler from "./Show/ViewToggler";
import axios from 'axios';

const _ = require('lodash');

export default {
  name: "Show",
  components: {ViewToggler, DocumentsTab, SpecificationsTab, ImageCarousel},
  data() {
    return {
      descriptionShowMore: false,
      descriptionLocal: '',
      descriptionLocalEditing: '',
      isEditingDescription: false,
      isSavingDescription: false
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
      isLoadingDetails: 'isLoadingDetails',
      view: 'view'
    }),

    ...mapGetters('shop', {
      basket: 'basket'
    }),

    fromShop() {
      return this.$route.query.fromShop;
    },

    description() {
      if (this.descriptionLocal) {
        return this.descriptionLocal;
      }
      return this.product['description'];
    },

    descriptionTooLong() {
      let length = this.product['description'].length;
      if (length > 1000) {
        return true;
      }
      return false;
    },

    descriptionToShow() {
      if (this.descriptionShowMore) {
        return this.description;
      }
      return this.description.substring(0, 1000);
    }
  },
  methods: {
    ...mapActions('productViewer', {
      loadProduct: 'loadProduct',
    }),

    ...mapActions('shop', {
      addProductToBasket: 'addProductToBasket',
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity',
      setProductQuantity: 'setProductQuantity'
    }),

    toggleDescriptionShowMore() {
      this.descriptionShowMore = !this.descriptionShowMore;
    },

    backToAllProducts() {
      this.$router.push('/products');
    },

    backToShop() {
      this.$router.push('/shop');
    },

    attemptLoadProduct() {
      this.loadProduct(this.$route.params.id);
    },

    isProductInBasket(product) {
      return _.filter(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['_id']
        );
      }).length > 0;
    },

    getQuantityOfProductInBasket(product) {
      return _.find(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === product['_id']
        );
      }).quantity;
    },

    editDescription() {
      this.isEditingDescription = true;
      this.descriptionLocalEditing = this.description;
    },

    cancelEditDescription() {
      this.isEditingDescription = false;
    },

    saveDescription() {
      let vm = this;
      vm.isSavingDescription = true;
      axios.post(window.API_BASE + '/products/' + this.product['_id'] + '/update-description', {
        description: this.descriptionLocalEditing
      }).then(() => {
        vm.isSavingDescription = false;
        vm.isEditingDescription = false;
        vm.descriptionLocal = vm.descriptionLocalEditing;
        vm.descriptionLocalEditing = null;
      }).catch(e => {
        console.log(e);
        vm.isSavingDescription = false;
        vm.$message.error('Error saving description');
      });
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

.page-inner-wrapper {
  margin-top: 90px;
  margin-bottom: 80px;

  h2 {
    margin-bottom: 20px;
  }

  .page-section {
    padding: 30px;
    background: #f9f9f9;
    margin-bottom: 60px;
    border-radius: 10px;
  }
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

.product-details-top {
  .ant-badge {
    margin-right: 5px;
  }

  .product-details-top-property {
    margin-right: 25px;
    display: inline;

    b {
      display: inline;
      margin-right: 5px;
    }
  }
}

.quantity-changer-wrapper {
  margin-top: 25px;

  .quantity-changer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 190px;

    .ant-input {
      width: 110px;
    }
  }
}
</style>