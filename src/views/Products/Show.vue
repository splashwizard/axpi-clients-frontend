<template>
  <div class="product-show">
    <loading-screen
        :is-loading="isLoading||isLoadingDocuments||isLoadingDetails||isSavingDescription||isLoadingPrices"></loading-screen>

    <a-page-header v-if="product && (fromShop||fromBasket)"
                   @back="handleBackButton"
    >
      <template slot="title">
        {{ product.name }}
        <approved-badge v-if="product.certified" style="margin-left: 20px"></approved-badge>
        <has-banned-materials-badge :product-id="product['_id']"
                                    style="margin-left: 20px;"></has-banned-materials-badge>
      </template>
      <template slot="extra">
        <view-toggler></view-toggler>
      </template>
    </a-page-header>
    <a-page-header v-if="product && !(fromShop||fromBasket)" :title="product.name">
      <template slot="extra">
        <view-toggler></view-toggler>
      </template>
    </a-page-header>

    <!--  Breadcrumb Wrapper -->
    <!--    <div class="breadcrumb-wrapper">-->
    <!--      <a-breadcrumb separator=">">-->
    <!--        <a-breadcrumb-item><router-link to="/">Home</router-link></a-breadcrumb-item>-->
    <!--        <a-breadcrumb-item><router-link to="/shop">Shop</router-link></a-breadcrumb-item>-->
    <!--        <a-breadcrumb-item>Product Details</a-breadcrumb-item>-->
    <!--      </a-breadcrumb>-->
    <!--    </div>-->
    <!-- / Breadcrumb Wrapper -->

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

      <!-- Manufacturer -->
      <div class="product-details-top-property">
        <b>Category:</b>
        {{ getCategory(product) }}
      </div>
      <!-- / Manufacturer -->

      <!-- Product Code -->
      <div class="product-details-top-property">
        <b>Product Code:</b>
        {{ product['productCode'] ? product['productCode'] : '-' }}
      </div>
      <!-- / Product Code -->

      <!-- Catalog Code -->
      <div class="product-details-top-property">
        <b>Catalog Code:</b>
        {{ product['catalogCode'] ? product['catalogCode'] : '-' }}
      </div>
      <!-- / Catalog Code -->
    </div>
    <!-- / Product details top -->

    <!-- Images & Description -->
    <div v-if="product" class="product-show-section">
      <a-row :gutter="10">
        <a-col :span="9">
          <image-carousel :urls="product['imageURLs']"></image-carousel>
        </a-col>

        <a-col :span="9">
          <div style="margin-bottom: 15px;" class="price-description">
            <h3 style="display: inline;">Price: </h3>
            <span class="price">
             {{
                selectedPrice ? formatCostInPence2dp({
                  cost: selectedPrice.price,
                  cost_currency: 'USD'
                }) : '-'
              }}
           </span>
            ({{ formatCostInPence2dp({cost: pricePerUnit, cost_currency: 'USD'}) }}/{{ unit }})

            <a href="#" @click.prevent="scrollToPrices">View more</a>
          </div>

          <div style="margin-bottom: 10px;">
            <h3 style="display: inline;">Description</h3>
            <a-button style="display: inline; margin-left: 10px;"
                      @click.prevent="editDescription" v-if="view == 'edit' && !isEditingDescription" size="small"
                      icon="edit" type="default"></a-button>
          </div>

          <!-- Not Editing -->
          <div v-if="view !== 'edit'">
            <div v-if="descriptionTooLong">
              <div v-html="descriptionToShow"></div>
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
            <div v-if="!descriptionTooLong" v-html="description">
            </div>
          </div>
          <!-- / Not Editing -->

          <!-- Editing -->
          <div v-if="view === 'edit'">
            <div v-if="isEditingDescription">
              <!--              <a-textarea-->
              <!--                  v-model="descriptionLocalEditing"-->
              <!--                  placeholder="Description..."-->
              <!--                  :auto-size="{ minRows: 10 }"-->
              <!--              />-->

              <div class="quill-editor-wrapper">
                <quill-editor
                    ref="myQuillEditor"
                    v-model="descriptionLocalEditing"
                />
              </div>

              <!-- Actions -->
              <div style="margin-top: 10px;">
                <a-button @click.prevent="cancelEditDescription" style="margin-right: 10px;" v-if="isEditingDescription"
                          type="default">Cancel
                </a-button>
                <a-button @click.prevent="saveDescription" v-if="isEditingDescription" type="primary">Save</a-button>
              </div>
              <!-- / Actions -->
            </div>
            <div v-else v-html="description"></div>
          </div>
          <!-- / Editing -->

        </a-col>

        <a-col :span="6">
          <div class="add-to-basket-wrapper">
            <!-- Top row -->
            <div class="top-row">
              <div class="left">
                <span class="price">{{
                    selectedPrice ? formatCostInPence2dp({
                      cost: selectedPrice.price,
                      cost_currency: 'USD'
                    }) : '-'
                  }}</span>
                ({{ formatCostInPence2dp({cost: pricePerUnit, cost_currency: 'USD'}) }}/{{ unit }})
              </div>
              <div class="right">
                <co2e-indicator :product="product"></co2e-indicator>
                <!--                <img src="/img/leaf.jpg" class="leaf" width="15" alt="Leaf">-->
                <!--                32kg CO2e-->
              </div>
            </div>
            <!-- / Top row -->

            <!-- Stock -->
            <div class="stock-wrapper">
              <!--              <a-icon v-if="isInStock(stockForSelectedPrice)" type="check-circle" theme="twoTone"-->
              <!--                      two-tone-color="#52c41a"></a-icon>-->
              <!--              <a-icon v-if="isOutOfStock(stockForSelectedPrice)" type="close-circle" theme="twoTone"-->
              <!--                      two-tone-color="#FF0000"></a-icon>-->
              <span class="stock-text"
                    :class="{'in-stock': isInStock(stockForSelectedPrice ? stockForSelectedPrice.stock : null), 'out-of-stock': isOutOfStock(stockForSelectedPrice ? stockForSelectedPrice.stock : null)}">{{
                  getStockText(stockForSelectedPrice ? stockForSelectedPrice.stock : null, false)
                }}</span>
            </div>
            <!-- / Stock -->

            <!-- Effectiveness Wrapper -->
            <div class="effectiveness-wrapper" v-if="product.effectiveness">
              <a-tag color="blue">
              <a-icon type="bulb"></a-icon> {{ formatEffectiveness(product.effectiveness) }} Effectiveness
              </a-tag>
            </div>
            <!-- / Effectiveness Wrapper -->

            <!-- Delivery by -->
            <!--            <div class="delivery-by">-->
            <!--              Delivery by Mon, Jan 10th-->
            <!--            </div>-->
            <!-- / Delivery by -->

            <!-- General details -->
            <div class="general-details">
              <div class="general-details-row">
                <div class="left">
                  Dispatches from
                </div>
                <div class="right">Chicago, Illinois</div>
              </div>
              <div class="general-details-row">
                <div class="left">
                  Sold by
                </div>
                <div class="right">
                  <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                      {{ selectedPrice ? selectedPrice.supplier_name : 'Select supplier' }}
                      <a-icon type="down"/>
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item v-for="(price, i) in prices" :key="i">
                        <a href="#" @click.prevent="() => selectPrice(price)">{{ price.supplier_name }}</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
            </div>
            <!-- / General details -->

            <!-- Address selector -->
            <div class="address-selector-wrapper">
              <address-selector-inline></address-selector-inline>
            </div>
            <!-- / Address selector -->

            <!-- Quantity: Not Editing -->
            <div v-if="view !== 'edit' && selectedPrice"
                 class="quantity-changer-wrapper">

              <div class="quantity-adder-wrapper">
                <a-input-group v-if="!isProductInBasket" class="quantity-input-group" compact>
                  <a-button icon="minus" @click.prevent="decrementQuantityToAdd"></a-button>
                  <a-input class="quantity-input" placeholder="1"
                           type="number"
                           v-model="quantityToAdd"></a-input>
                  <a-button icon="plus" @click.prevent="incrementQuantityToAdd"></a-button>
                </a-input-group>
                <a-button v-if="!isProductInBasket" class="add-button button-yellow"
                          type="default" @click.prevent="() => addToBasket()">Add to basket
                </a-button>
              </div>

              <div v-if="isProductInBasket" class="quantity-changer">
                <a-input-group compact class="quantity-input-group">
                  <a-button
                      @click.prevent="() => decrementProductQuantity({product: product, selectedPriceId: selectedPrice.id})"
                      icon="minus">
                  </a-button>
                  <a-input type="number" class="quantity-input"
                           @change="e => setProductQuantity({quantity: e.target.value, id: product['_id'], selectedPriceId: selectedPrice.id})"
                           :value="quantityOfProductInBasket"></a-input>
                  <a-button
                      @click.prevent="() => incrementProductQuantity({product: product, selectedPriceId: selectedPrice.id})"
                      icon="plus"></a-button>
                </a-input-group>
                <!--                        <div>{{ getQuantityOfProductInBasket(item) }}</div>-->

              </div>
            </div>
            <!-- / Quantity: Not Editing -->
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- / Images & Description -->

    <!-- Suggested Products -->
    <div class="suggested-products-wrapper">
      <suggested-products v-if="product" :product="product"></suggested-products>
    </div>
    <!-- / Suggested Products -->

    <!-- Properties -->
    <div class="page-inner-wrapper" :key="reloadKey">

      <!-- Navbar -->
      <div class="product-navbar" ref="product-navbar" :class="{'fixed': isNavbarFixed}">
        <div class="nav-link">
          <a-tabs v-model="selectedTab" @tabClick="handleTabClicked">
            <a-tab-pane key="properties" tab="Properties"></a-tab-pane>
            <a-tab-pane key="pricing" tab="Pricing"></a-tab-pane>
            <a-tab-pane key="environment" tab="Environment"></a-tab-pane>
            <a-tab-pane key="documents" tab="Documents"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <!-- / Navbar -->

      <!-- Not editing -->
      <a-row :gutter="20" v-if="view !== 'edit'" type="flex" class="page-sections-cols">
        <a-col :span="12">
          <div class="page-section page-section-col" ref="properties-tab">
            <h2>Properties</h2>
            <specifications-tab></specifications-tab>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="page-section page-section-col" ref="pricing-tab">
            <h2>Pricing</h2>
            <pricing-tab :prices="prices" :stocks="stocks"></pricing-tab>
          </div>
        </a-col>
      </a-row>
      <!-- / Not editing -->

      <!--  Editing -->
      <div class="page-section" ref="properties-tab" v-if="view === 'edit'">
        <h2>Properties</h2>
        <specifications-tab></specifications-tab>
      </div>

      <div class="page-section" ref="pricing-tab" v-if="view === 'edit'">
        <h2>Pricing</h2>
        <pricing-tab :prices="prices" :stocks="stocks"></pricing-tab>
      </div>
      <!-- / Editing -->

      <div class="page-section" ref="environment-tab">
        <h2>Environment</h2>
        <environment-tab></environment-tab>
      </div>

      <div class="page-section" ref="documents-tab">
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
import AddressSelectorInline from "./Show/AddressSelectorInline";
import Orders from "../../mixins/Orders";
import EnvironmentTab from "./Show/EnvironmentTab";
import PricingTab from "./Show/PricingTab";
import SuggestedProducts from "../../components/Products/SuggestedProducts";
import StockManagement from "../../mixins/StockManagement";
import Co2eIndicator from "./Show/Co2eIndicator";
import ApprovedBadge from "./Show/ApprovedBadge";
import HasBannedMaterialsBadge from "./Show/HasBannedMaterialsBadge";

const _ = require('lodash');

export default {
  name: "Show",
  components: {
    HasBannedMaterialsBadge,
    ApprovedBadge,
    Co2eIndicator,
    AddressSelectorInline,
    ViewToggler,
    DocumentsTab,
    SpecificationsTab,
    ImageCarousel,
    EnvironmentTab,
    PricingTab,
    SuggestedProducts
  },
  mixins: [Orders, StockManagement],
  data() {
    return {
      descriptionShowMore: false,
      descriptionLocal: '',
      descriptionLocalEditing: '',
      isEditingDescription: false,
      isSavingDescription: false,

      quantityToAdd: 1,

      reloadKey: 1,
      isMounted: false,
      selectedTab: 'properties',

      isNavbarFixed: false
    }
  },
  created() {
    this.attemptLoadProduct();
  },
  mounted() {
    this.isMounted = true;
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
      isLoadingPrices: 'isLoadingPrices',
      isLoadingStocks: 'isLoadingStocks',
      view: 'view',
      prices: 'prices',
      stocks: 'stocks',
      selectedPrice: 'selectedPrice',
      stockForSelectedPrice: 'stockForSelectedPrice'
    }),

    ...mapGetters('shop', {
      basket: 'basket'
    }),

    productId() {
      if (this.product) {
        return this.product['id'] ? this.product['id'] : this.product['_id'];
      }
      return null;
    },

    isProductInBasket() {
      return _.filter(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === this.productId
            && item.selectedPriceId === this.selectedPrice.id
        );
      }).length > 0;
    },

    quantityOfProductInBasket() {
      return _.find(this.basket, item => {
        return (
            item.itemType === 'product'
            && item.id === this.productId
            && item.selectedPriceId === this.selectedPrice.id
        );
      }).quantity;
    },

    fromShop() {
      return this.$route.query.fromShop;
    },

    fromBasket() {
      return this.$route.query.fromBasket;
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
    },

    pricePerUnit() {
      let selectedPrice = this.selectedPrice ? this.selectedPrice.price : null;
      let normalisedUnitMagnitude = this.product.normalisedQuantity ? this.product.normalisedQuantity.normalisedUnitMagnitude : null;

      if (selectedPrice && normalisedUnitMagnitude) {
        return selectedPrice / normalisedUnitMagnitude;
      }

      return '-';
    },

    unit() {
      if (this.product.normalisedQuantity) {
        if (this.product.normalisedQuantity.normalisedUnitBase === 'dimensionless') {
          return 'unit';
        }
        return this.product.normalisedQuantity.normalisedUnitBase;
      }
      return '-';
    }
  },
  methods: {
    ...mapActions('productViewer', {
      loadProduct: 'loadProduct',
      selectPrice: 'selectPrice'
    }),

    ...mapActions('shop', {
      addProductToBasket: 'addProductToBasket',
      incrementProductQuantity: 'incrementProductQuantity',
      decrementProductQuantity: 'decrementProductQuantity',
      setProductQuantity: 'setProductQuantity'
    }),

    formatEffectiveness(effectiveness) {
      return effectiveness.charAt(0).toUpperCase() + effectiveness.slice(1).toLowerCase();
    },

    getCategory(product) {
      if (product.taxonomyCategory) {
        return product.taxonomyCategory[product.taxonomyCategory.length - 1];
      }
      return 'Miscellaneous';
    },

    decrementQuantityToAdd() {
      if (this.quantityToAdd && !isNaN(this.quantityToAdd)) {
        this.quantityToAdd--;
        if (this.quantityToAdd < 1) {
          this.quantityToAdd = 1;
        }
      } else {
        this.quantityToAdd = 1;
      }
      this.$nextTick(() => {
        this.$forceUpdate();
      })
    },

    incrementQuantityToAdd() {
      if (this.quantityToAdd && !isNaN(this.quantityToAdd)) {
        this.quantityToAdd++;
      } else {
        this.quantityToAdd = 1;
      }
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    handleTabClicked(e) {
      this.$refs[e + '-tab'].scrollIntoView({behavior: "smooth"});
    },

    addToBasket() {
      let quantity = this.quantityToAdd;
      if (!quantity) {
        quantity = 1;
      }
      this.addProductToBasket({
        product: this.product,
        quantity: quantity,
        selectedPrice: this.selectedPrice,
        selectedPriceId: this.selectedPrice.id,
        prices: this.prices
      });
    },

    toggleDescriptionShowMore() {
      this.descriptionShowMore = !this.descriptionShowMore;
    },

    backToAllProducts() {
      this.$router.push('/products');
    },

    backToShop() {
      this.$router.push('/shop');
    },

    backToBasket() {
      this.$router.push('/shop/basket')
    },

    handleBackButton() {
      if (this.fromBasket) {
        this.backToBasket();
      }
      if (this.fromShop) {
        this.backToShop();
      }
    },

    attemptLoadProduct() {
      this.loadProduct(this.$route.params.id);
      this.reset();
    },

    reset() {
      this.reloadKey += 1;
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
    },

    scrollToPrices() {
      this.$refs['pricing-tab'].scrollIntoView({behavior: "smooth"});
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

.suggested-products-wrapper {
  //margin-top: 100px;
  margin-top: 80px;
  border-top: 1px solid #d9d9d9;
  padding-top: 35px;
  //margin-bottom: 30px;
}

.page-inner-wrapper {
  .product-navbar {
    margin-top: 10px;
    margin-bottom: 10px;
    //padding: 15px;
    //border: 1px solid #d9d9d9;
    //border-radius: 5px;
  }

  //margin-top: 20px;
  //margin-top: 50px;
  margin-bottom: 80px;

  h2 {
    margin-bottom: 20px;
  }

  .page-sections-cols {
    margin-bottom: 40px;
  }

  .page-section {
    padding: 30px;
    background: #f9f9f9;
    margin-bottom: 40px;
    border-radius: 10px;

    &.page-section-col {
      height: 100%;
      margin-bottom: 0 !important;
    }
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

  .quantity-input-group {
    margin-left: auto;
    margin-right: auto;

    .quantity-input {
      width: calc(100% - 32px - 32px);

      -moz-appearance: textfield;
      text-align: center;
      padding-left: 7px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  //.quantity-changer {
  //  display: flex;
  //  align-items: center;
  //  justify-content: space-between;
  //  width: 190px;
  //
  //  .ant-input {
  //    width: 110px;
  //  }
  //}
}

.quantity-adder-wrapper {

  .add-button {
    width: 100%;
    margin-top: 10px;
  }

  //@media screen and (min-width: 1390px) {
  //  //display: flex;
  //  //max-width: 250px;
  //
  //  //.add-button {
  //  //  margin-top: 0;
  //  //}
  //
  //  .quantity-input-group {
  //    margin-right: 10px;
  //
  //    .quantity-input {
  //      width: 30px !important;
  //    }
  //  }
  //}

  .quantity-input-group {
    margin-left: auto;
    margin-right: auto;

    .quantity-input {
      width: calc(100% - 32px - 32px);

      -moz-appearance: textfield;
      text-align: center;
      padding-left: 7px;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

}

.breadcrumb-wrapper {
  margin-bottom: 20px;
}

.quill-editor-wrapper {
  padding-top: 15px;
  padding-bottom: 15px;
}

.add-to-basket-wrapper {
  margin-left: 30px;
  padding: 15px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;

  .top-row {
    margin-bottom: 18px;
    display: flex;
    align-items: center;

    .left {
      flex-grow: 1;
    }

    .right {
      align-items: center;
      display: flex;
      flex-shrink: 1;

      min-width: 110px;
      text-align: right;
      justify-content: flex-end;

      .leaf {
        margin-right: 6px;
      }
    }
  }

  .price {
    font-size: 21px;
    color: #1890ff;
  }

  .delivery-by {
    margin-top: 7px;
    font-size: 18px;
  }

  .general-details {
    margin-top: 14px;

    .general-details-row {
      display: flex;
      margin-bottom: 4px;

      .left {
        flex: 1;
      }

      .right {
        flex: 1;
      }
    }
  }

  .effectiveness-wrapper {
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .stock-wrapper {
    //margin-top: 23px;
    display: flex;
    align-items: center;

    .stock-text {
      font-size: 20px;

      &.in-stock {
        color: #52c41a;
      }

      &.out-of-stock {
        color: #FF0000;
      }
    }

    .anticon {
      margin-right: 10px;
    }
  }

  .address-selector-wrapper {
    margin-top: 23px;
  }

  .delivery-details {
    margin-top: 10px;
  }
}

.price-description {
  .price {
    font-size: 17px;
    margin-left: 4px;
    margin-right: 4px;
    color: #1890ff;
  }
}
</style>